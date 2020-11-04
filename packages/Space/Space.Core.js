const Point = require('../Point')
const {
  isCloseTo
} = require('../shared/utils')
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

    this.previousVisitedIndex = 0
    this.visitingIndex = 0
    this.keyPoints = []
    this.directions = []

    this.visitedPoints = []
    this.checkedPoints = []
    this.check(new Point(origin, config))

    this.destroyed = false
    this.onProgress = null
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

    this.beforeUpdateMinDistance()
    this.minDistance = point.distance
    this.minDistancePoint = point
    // this.visitedPoints.push(point)

    this.stepCount ++
    return true
  },

  updateVisitingIndex () {
    this.visitingIndex = (this.visitingIndex + 1) % this.dimension
  },

  beforeUpdateMinDistance () {
    const indexSwitched = this.visitingIndex !== this.previousVisitedIndex
    if (indexSwitched) {
      this.updateSettledKeyPoint(this.previousVisitedIndex)
      this.previousVisitedIndex = this.visitingIndex
    }
  },

  updateSettledKeyPoint (index) {
    const previousKeyPoint = this.keyPoints[index]
    this.updateDirection(index, previousKeyPoint, this.minDistancePoint)
    this.keyPoints[index] = this.minDistancePoint
  },

  updateDirection (index, previousKeyPoint, currentKeyPoint) {
    this.directions[index] = previousKeyPoint
      ? previousKeyPoint.getDirection(currentKeyPoint, this.visitingIndex)
      : this.directions[index]
  },

  resetStartPoint () {
    this.keyPoints = []
    this.directions = []
    this.minDistancePoint.shakeOff()
  },

  extendDimension () {
    this.dimension ++
    this.minDistancePoint.shakeOffChainPoints()
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
  },

  destroy () {
    this.destroyed = true
    this.keyPoints.length = 0
    this.directions.length = 0
    this.visitedPoints.length = 0
    this.checkedPoints.length = 0
    this.minDistancePoint.shakeOff()
    this.onProgress = null
  }
}
