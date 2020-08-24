const Atom = require('./Atom')
const Point = require('./Point')
const {
  randomNaturalNumber,
  isCloseTo
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
  }

  print () {
    console.log(`
    checkCount: ${this.checkCount}
    dimension: ${this.dimension}
    minDistance: ${this.minDistance}
    minDistancePoints: ${this.getRandomMinDistancePoint().getNomials()}
    `)
  }

  check (point) {
    this.checkCount ++
    point.distance = this.meanSquaredError(point)
    this.updateMinDistance(point)
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
      point.isCloseTo(this.minDistancePoints[this.minDistancePoints.length - 1])
    ) {
      return
    }

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

  findRandomMinNeighbor () {
    return this.getRandomMinDistancePoint().findRandomNeighbor()
  }

  exploreLocalMinimum (timeLimit = 1) {
    const timePlaned = timeLimit * 1000
    const startAt = +new Date()
    while (true) {
      if ((new Date() - startAt) > timePlaned) return
      if (this.zeroDistancePoints.length) return
      try {
        this.check(this.findRandomMinNeighbor())
      } catch (error) {
        if (error !== Atom.NEIGHBOR_COLLISION_ERROR) throw error
        if (this.areAllMinDistancePointsTrapped()) this.extendDimension()
      }
    }
  }

  findThePoint (timeLimit = 1) {
    if (this.zeroDistancePoints.length) return this.zeroDistancePoints[0]
    this.exploreLocalMinimum(timeLimit)
    return this.getRandomMinDistancePoint()
  }
}

module.exports = Space
