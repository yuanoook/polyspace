const Point = require('./Point')
const {
  isCloseTo,
  isCloseToPeriod,
  sleep,
  randomSubList
} = require('./utils')
const { scatter3 } = require('./printMatlab')

class Space {
  static PRECISION = 6
  static BOREDOM_TOLERANCE = 6
  static TIME_BUDGET_DEFAULT = 5
  constructor (translation = () => 0, config = {}) {
    this.translation = translation
    this.inputs = []
    this.expectations = []
    Object.assign(this, config)
  }

  take (inputs, expectations) {
    this.inputs = this.inputs.concat(inputs)
    this.expectations = this.expectations.concat(expectations)
    this.setup()
    return this
  }

  setup (origin = [0]) {
    this.minDistance = Infinity
    this.minDistancePoint = null
    this.dimension = origin.length
    this.stepCount = 0
    this.checkCount = 0
    this.lastSearchTimeUsed = 0
    this.visitedPoints = []
    this.checkedPoints = []
    this.check(new Point(origin))
  }

  gotPerfectSolution () {
    return isCloseTo(this.minDistance, 0, Space.PRECISION)
  }

  printMinNeighbors () {
    const minNeighborsNomials = this.minDistancePoint.printNeighbors(false)
    return JSON.stringify(minNeighborsNomials, null, 2)
  }

  regularSample (log, amount = 100) {
    const logLength = log.length
    const samplingPeriod = Math.floor(logLength / amount)
    return log
      .filter((_, index) => !(index % samplingPeriod))
      .map(point => point.extendDimension(this.dimension))
  }

  randomSample (log, amount = 100) {
    return randomSubList(log, amount)
      .map(point => point.extendDimension(this.dimension))
  }

  sampleLog (log, amount) {
    return this.randomSample(log, amount)
  }

  printPointsLog (log, amount) {
    return this.sampleLog(log, amount)
      .map(point => point.getNomials().join('\t'))
      .join('\n')
  }

  printScatter3 (log, amount) {
    const points = this.sampleLog(log, amount)
    const [x, y, z] = [[], [], []]
    for (let point of points) {
      const nomials = point.getNomials()
      x.push(nomials[0])
      y.push(nomials[1])
      z.push(point.distance)
    }
    return scatter3(x, y, z)
  }

  printVisitedPoints (logSampleAmount) {
    return this.printPointsLog(this.visitedPoints, logSampleAmount)
  }

  printCheckedPoints (logSampleAmount) {
    return this.printPointsLog(this.checkedPoints, logSampleAmount)
  }

  printVisitedPointsScatter3 (logSampleAmount) {
    return this.printScatter3(this.visitedPoints, logSampleAmount)
  }

  printCheckedPointsScatter3 (logSampleAmount) {
    return this.printScatter3(this.checkedPoints, logSampleAmount)
  }

  printSolution ({
    precision = Space.PRECISION,
    solutionFormatter = x => x,
    showMinNeighbors = false,
    showVisitedPoints = false,
    showCheckedPoints = false,
    showMatlabScatter3 = false,
    logSampleAmount = 100
  } = {}) {
    const thePoint = this.minDistancePoint
    const solutionNomials = thePoint.getTrimmedNomials(precision)
    const solution = solutionFormatter(solutionNomials)
    const successTrialRate = (100 * this.stepCount / this.checkCount).toFixed(2)
    const matlabScatter3 = showMatlabScatter3 ? `\n${
      showVisitedPoints ? 'Visited Points\n' + this.printVisitedPointsScatter3(logSampleAmount) : ''
    }\n\n${
      showCheckedPoints ? 'Checked Points\n' + this.printCheckedPointsScatter3(logSampleAmount) : ''
    }` : ''

    console.log(`Find${
      this.gotPerfectSolution() ? ' perfect' : '' } solution: ${
      solution} \n  in ${
      this.lastSearchTimeUsed } ms in ${
      this.stepCount } steps \n  tried ${
      this.checkCount } times in ${
      this.dimension } dimensions \n  with success trial rate ${
      successTrialRate}% \n  got min distance ${
      this.minDistance } \n${
      showMinNeighbors ? this.printMinNeighbors() : ''} \n${
      showVisitedPoints
        ? '\nVisited Points: \n' + this.printVisitedPoints(logSampleAmount)
        : ''} \n${
      showCheckedPoints
        ? '\nChecked Points: \n' + this.printCheckedPoints(logSampleAmount)
        : ''} \n${
      matlabScatter3
    }`)
  }

  check (point) {
    this.checkCount ++
    point.distance = this.meanSquaredError(point)
    return this.updateMinDistance(point)
  }

  isMinDistancePointTrapped () {
    return this.minDistancePoint.isTrapped()
  }

  updateMinDistance (point) {
    this.checkedPoints.push(point)
    if (point.distance >= this.minDistance) return false

    this.minDistance = point.distance
    this.minDistancePoint = point
    this.visitedPoints.push(point)
    this.stepCount ++
    return true
  }

  extendDimension () {
    this.dimension ++
    this.minDistancePoint.shakeChainPoints()
    this.minDistancePoint.extendDimension(this.dimension)
  }

  squaredError (point, input, expectation) {
    const system = this.translation(point.getNomials())
    const output = system(input)
    return (expectation - output) ** 2
  }

  meanSquaredError (point) {
    const totalSquaredError = this.inputs.reduce((error, input, index) =>
      error + this.squaredError(point, input, this.expectations[index])
    , 0)
    return Math.sqrt(totalSquaredError)
  }

  findRandomMinNeighbor () {
    return this.minDistancePoint.findRandomNeighbor()
  }

  findMinBiNeighbors () {
    return this.minDistancePoint.findBiNeighbors()
  }

  checkMinBiNeighbors () {
    const minBiNeighbors = this.findMinBiNeighbors()
    for (let biNeighbor of minBiNeighbors)
      this.check(biNeighbor)
    //   if (this.check(biNeighbor)) break

    return minBiNeighbors
  }

  exploreMinBiNeighbors(maxDimensions) {
    const minBiNeighbors = this.checkMinBiNeighbors()
    if (!minBiNeighbors.length && (this.dimension < maxDimensions)) {
      this.extendDimension()
      return this.checkMinBiNeighbors()
    }
    return minBiNeighbors
  }

  async exploreLocalMinimum ({timeBudget, countBudget, maxDimensions}) {
    const timePlaned = timeBudget * 1000
    const startAt = +new Date()
    let count = 0
    while (count < countBudget) {
      const timeUsed= new Date() - startAt
      if (timeUsed > timePlaned) break
      if (this.gotPerfectSolution()) break
      if (isCloseToPeriod(timeUsed, 100)) await sleep(0)
      if (this.exploreMinBiNeighbors(maxDimensions).length <= 0) break
      count ++
    }
    const totalTimeUsed = new Date() - startAt
    this.lastSearchTimeUsed = totalTimeUsed || this.lastSearchTimeUsed
  }

  async findThePoint ({
    timeBudget = Infinity,
    countBudget = Infinity,
    maxDimensions = Infinity
  } = {}) {
    if (timeBudget === Infinity &&
      countBudget === Infinity
    ) timeBudget = Space.TIME_BUDGET_DEFAULT
    await this.exploreLocalMinimum({timeBudget, countBudget, maxDimensions})
    return this.minDistancePoint
  }
}

module.exports = Space
