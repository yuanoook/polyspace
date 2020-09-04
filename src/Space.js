const Point = require('./Point')
const {
  isCloseTo,
  isCloseToPeriod,
  sleep,
  randomSubList
} = require('./utils')
const SpacePrint = require('./Space.print')

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
    this.biNeighborMatrixCheckIndex = 0
    this.check(new Point(origin))
  }

  gotPerfectSolution () {
    return isCloseTo(this.minDistance, 0, Space.PRECISION)
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

  findBiNeighbors () {
    return this.minDistancePoint.findBiNeighbors()
  }

  checkBiNeighbors () {
    const biNeighbors = this.findBiNeighbors()
    for (let biNeighbor of biNeighbors)
      if (this.check(biNeighbor)) break
    return biNeighbors
  }

  findBiNeighborsMatrix () {
    return this.minDistancePoint.findBiNeighborsMatrix()
  }

  checkBiNeighborsMatrixList (list) {
    for (let point of list)
      if(this.check(point)) return true
    return false
  }

  checkBiNeighborsMatrix () {
    const matrix = this.findBiNeighborsMatrix()
    let matrixIsNotEmpty = false
    let count = 0
    while (count < this.dimension) {
      const list = matrix[this.biNeighborMatrixCheckIndex]
      matrixIsNotEmpty = matrixIsNotEmpty || (list.length > 0)
      if (this.checkBiNeighborsMatrixList(list)) break
      count ++
      this.biNeighborMatrixCheckIndex ++
      this.biNeighborMatrixCheckIndex = this.biNeighborMatrixCheckIndex % this.dimension
    }
    return matrixIsNotEmpty
  }

  // exploreBiNeighborsMatrix performs 8% faster than exploreBiNeighbors
  // by index preferring & quick breaking
  // Quick breaking contributes the most performance improvement
  // Index preferring adds a slight advantage
  exploreBiNeighborsMatrix(maxDimensions) {
    const exploredSome = this.checkBiNeighborsMatrix()
    if (!exploredSome && (this.dimension < maxDimensions)) {
      this.extendDimension()
      return this.checkBiNeighborsMatrix()
    }
    return exploredSome
  }

  exploreBiNeighbors(maxDimensions) {
    const minBiNeighbors = this.checkBiNeighbors()
    if (!minBiNeighbors.length && (this.dimension < maxDimensions)) {
      this.extendDimension()
      return this.checkBiNeighbors()
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
      if (!this.exploreBiNeighborsMatrix(maxDimensions)) break
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

Object.assign(Space.prototype, {
  ...SpacePrint
})

module.exports = Space
