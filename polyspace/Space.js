const Atom = require('./Atom')
const Point = require('./Point')
const {
  randomNaturalNumber,
  isCloseTo,
  isCloseToPeriod,
  last,
  sleep,
  validatePositive
} = require('./utils')

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
    this.visitedPointsLog = []
    this.checkedPointsLog = []
    this.check(new Point(origin))
  }

  gotPerfectSolution () {
    return isCloseTo(this.minDistance, 0, Space.PRECISION)
  }

  printMinNeighbors () {
    const minNeighborsNomials = this.minDistancePoint.printNeighbors(false)
    return JSON.stringify(minNeighborsNomials, null, 2)
  }

  printPointsLog (log, samplingRate = 1 / 100) {
    const logLength = log.length
    const samplingPeriod = Math.floor(logLength * samplingRate)
    return log
      .filter((_, index) => !(index % samplingPeriod))
      .map(nomials => nomials.join(', ')).join('\n')
  }

  printVisitedPoints (logSamplingRate) {
    return this.printPointsLog(this.visitedPointsLog, logSamplingRate)
  }

  printCheckedPoints (logSamplingRate) {
    return this.printPointsLog(this.checkedPointsLog, logSamplingRate)
  }

  printSolution ({
    precision = Space.PRECISION,
    solutionFormatter = x => x,
    showMinNeighbors = false,
    showVisitedPoints = false,
    showCheckedPoints = false,
    logSamplingRate = 1 / 100
  } = {}) {
    const thePoint = this.minDistancePoint
    const solutionNomials = thePoint.getTrimmedNomials(precision)
    const solution = solutionFormatter(solutionNomials)
    const successTrialRate = (100 * this.stepCount / this.checkCount).toFixed(2)

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
      showVisitedPoints ? this.printVisitedPoints(logSamplingRate) : ''} \n${
      showCheckedPoints ? this.printCheckedPoints(logSamplingRate) : ''
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
    const nomials = point.getNomials()
    this.checkedPointsLog.push(nomials)
    if (point.distance >= this.minDistance) return false

    this.minDistance = point.distance
    this.minDistancePoint = point
    this.visitedPointsLog.push()
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
