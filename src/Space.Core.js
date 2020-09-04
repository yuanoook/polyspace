const Point = require('./Point')
const {
  isCloseTo
} = require('./utils')
const SpaceConst = require('./Space.Const')

module.exports = {
  take (inputs, expectations) {
    this.inputs = this.inputs.concat(inputs)
    this.expectations = this.expectations.concat(expectations)
    this.setup()
    return this
  },

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
  },

  gotPerfectSolution () {
    return isCloseTo(this.minDistance, 0, SpaceConst.PRECISION)
  },

  check (point) {
    this.checkCount ++
    point.distance = this.meanSquaredError(point)
    return this.updateMinDistance(point)
  },

  isMinDistancePointTrapped () {
    return this.minDistancePoint.isTrapped()
  },

  updateMinDistance (point) {
    this.checkedPoints.push(point)
    if (point.distance >= this.minDistance) return false

    this.minDistance = point.distance
    this.minDistancePoint = point
    this.visitedPoints.push(point)
    this.stepCount ++
    return true
  },

  extendDimension () {
    this.dimension ++
    this.minDistancePoint.shakeChainPoints()
    this.minDistancePoint.extendDimension(this.dimension)
  },

  squaredError (point, input, expectation) {
    const system = this.translation(point.getNomials())
    const output = system(input)
    return (expectation - output) ** 2
  },

  meanSquaredError (point) {
    const totalSquaredError = this.inputs.reduce((error, input, index) =>
      error + this.squaredError(point, input, this.expectations[index])
    , 0)
    return Math.sqrt(totalSquaredError)
  }
}
