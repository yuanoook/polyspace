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
  }

  setup () {
    this.checkCount = 0
    this.dimension = 1
    this.origin = new Point([0])
    this.zeroDistancePoints = []
    this.minDistance = Infinity
    this.minDistancePoints = []
    this.check(this.origin)
    this.lastSearchTimeUsed = 0
  }

  printSolution () {
    const minNeighborsNomials = this
      .getFirstMindDistancePoint()
      .printNeighbors(false)

    console.log(`
Solution: ${this.getFirstMindDistancePoint().getTrimmedNomials()}
Distance: ${this.minDistance}
Dimension: ${this.dimension}
Points Checked: ${this.checkCount}
Last Search Time Used: ${this.lastSearchTimeUsed} ms
Min-Distance Points: ${this.minDistancePoints.length}
Min-Neighbors: ${JSON.stringify(minNeighborsNomials, null, 2)}
    `)
  }

  check (point) {
    this.checkCount ++
    point.distance = this.meanSquaredError(point)
    this.updateMinDistance(point)
  }

  // TODO: add test
  lastMinDistancePoint () {
    return last(this.minDistancePoints)
  }

  // TODO: add test
  areAllMinDistancePointsTrapped () {
    return !this.minDistancePoints.some(point => !point.isTrapped())
  }

  updateMinDistance (point) {
    if (point.distance > this.minDistance) return

    if (point.distance < this.minDistance) {
      this.minDistancePoints.length = 0
    }

    if (point.distance === this.minDistance &&
      this.minDistancePoints.length &&
      point.isCloseTo(this.lastMinDistancePoint())
    ) return

    if (this.minDistancePoints.indexOf(point) < 0) {
      this.minDistancePoints.push(point)
    }

    this.minDistance = point.distance
    this.updateZeroDistance(point)
  }

  updateZeroDistance (point) {
    if (isCloseTo(point.distance, 0, Space.PRECISION))
      this.zeroDistancePoints.push(point)
  }

  getAllPoints () {
    return this.origin.getInNetworkPoints()
  }

  // TODO - While try to extendDimension, remove all
  extendDimension () {
    this.dimension ++
    // TODO - Shake points to save computing
    // this.getAllPoints().map(point => point.extendDimension(this.dimension))
    this.minDistancePoints.map(point => point.extendDimension(this.dimension))
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

  getRandomMinDistancePoint () {
    const points = this.minDistancePoints
    return points[randomNaturalNumber(points.length)]
  }

  getFirstMindDistancePoint () {
    return this.minDistancePoints[0]
  }

  findRandomMinNeighbor () {
    return this.getRandomMinDistancePoint().findRandomNeighbor()
  }

  findMinBiNeighbors () {
    return this.getFirstMindDistancePoint().findBiNeighbors()
  }

  checkMinBiNeighbors () {
    const minBiNeighbors = this.findMinBiNeighbors()
    for (let biNeighbor of minBiNeighbors) this.check(biNeighbor)
    return minBiNeighbors
  }

  exploreMinBiNeighbors() {
    const minBiNeighbors = this.checkMinBiNeighbors()
    if (!minBiNeighbors.length) {
      this.extendDimension()
      return this.checkMinBiNeighbors()
    }
    return minBiNeighbors
  }

  async exploreLocalMinimum ({timeBudget, countBudget}) {
    const timePlaned = timeBudget * 1000
    const startAt = +new Date()
    let count = 0
    while (count < countBudget) {
      const timeUsed= new Date() - startAt
      if (timeUsed > timePlaned) break
      if (this.zeroDistancePoints.length) break
      if (isCloseToPeriod(timeUsed, 100)) await sleep(0)
      this.exploreMinBiNeighbors()
      count ++
    }
    const totalTimeUsed = new Date() - startAt
    this.lastSearchTimeUsed = totalTimeUsed || this.lastSearchTimeUsed
  }

  async findThePoint ({
    timeBudget = Infinity,
    countBudget = Infinity
  } = {timeBudget: 1}) {
    await this.exploreLocalMinimum({timeBudget, countBudget})
    return this.getRandomMinDistancePoint()
  }
}

module.exports = Space
