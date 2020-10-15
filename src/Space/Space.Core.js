const Point = require('../Point')
const {
  isCloseTo
} = require('../utils')
const SpaceConst = require('./Space.Const')

module.exports = {
  take (inputs, expectations) {
    this.inputs = this.inputs.concat(inputs)
    this.expectations = this.expectations.concat(expectations)
    return this
  },

  setup (origin = [0], config) {
    this.minDistance = Infinity
    this.minDistancePoint = null
    this.dimension = origin.length
    this.stepCount = 0
    this.checkCount = 0
    this.lastSearchTimeUsed = 0

    this.visitingIndex = 0
    this.visitedPointCount = 0
    this.lastVisitedPoint = null

    this.keyPoints = []
    this.visitedPoints = []
    this.checkedPoints = []
    this.check(new Point(origin, config))
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
    // this.checkedPoints.push(point)
    if (point.distance >= this.minDistance) return false

    this.minDistance = point.distance
    this.minDistancePoint = point
    this.updateVisitedPoint(point)
    this.stepCount ++
    return true
  },

  updateVisitedPoint (point) {
    this.visitedPointCount ++
    this.visitedPoints.push(point)

  },

  updateVisitingIndex () {
    this.updateKeyPoint()
    this.visitingIndex ++
    this.visitingIndex = this.visitingIndex % this.dimension
  },

  updateKeyPoint () {
    const previousKeyPoint = this.keyPoints[this.visitingIndex]
    this.updateDirectionDelta(previousKeyPoint, this.minDistancePoint)
    this.keyPoints[this.visitingIndex] = this.minDistancePoint
  },

  updateDirectionDelta (previousKeyPoint, currentKeyPoint) {
    this.directionDelta = currentKeyPoint - previousKeyPoint
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
