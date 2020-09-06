const {
  isCloseTo
} = require('../utils')
const AtomConst = require('./Atom.Const')
const AtomNeighbor = require('./Atom.Neighbor')
const AtomConnected = require('./Atom.Connected')
const AtomWalk = require('./Atom.Walk')
const AtomChain = require('./Atom.Chain')

class Atom {
  static PRECISION = AtomConst.PRECISION
  static LEFT_INFINITY = AtomConst.LEFT_INFINITY
  static RIGHT_INFINITY = AtomConst.RIGHT_INFINITY
  // Add config boundary :D
  static LEFT_SAFE_INTEGER = AtomConst.LEFT_SAFE_INTEGER
  static RIGHT_SAFE_INTEGER = AtomConst.RIGHT_SAFE_INTEGER
  static DISTANCE_RATIO_HALF = AtomConst.DISTANCE_RATIO_HALF
  static DISTANCE_STEP_ONE = AtomConst.DISTANCE_STEP_ONE
  static SCALE_DEPTH_LOG2_NATURAL = AtomConst.SCALE_DEPTH_LOG2_NATURAL
  static SCALE_DEPTH_LOG2_REAL = AtomConst.SCALE_DEPTH_LOG2_REAL
  static SCALE_DEPTH_LOG2_MIN_VALUE = AtomConst.SCALE_DEPTH_LOG2_MIN_VALUE
  static SCALE_DEPTH_LOG2 = AtomConst.SCALE_DEPTH_LOG2

  static NEIGHBOR_COLLISION_ERROR = AtomConst.NEIGHBOR_COLLISION_ERROR

  constructor (value = 0, config = {}) {
    this.validateValue(value)
    this.value = value
    this.left = null
    this.right = null
    Object.assign(this, config)
  }

  newAtom (value, config) {
    return new Atom(value, {
      // TODO: finish this :D
      unit: this.unit,
      limits: this.limits,
      ...config
    })
  }

  validateValue (value) {
    if (value < Atom.LEFT_SAFE_INTEGER ||
      value > Atom.RIGHT_SAFE_INTEGER
    ) throw new Error(`Atom.LEFT_SAFE_INTEGER(${
      Atom.LEFT_SAFE_INTEGER
    }) < value < Atom.RIGHT_SAFE_INTEGER(${
      Atom.RIGHT_SAFE_INTEGER
    }). We get ${value}`)
    return true
  }

  getValue () {
    return this.value
  }

  getLeftSafeValue () {
    const leftNeighborValue = this.getLeftNeighborValue()
    return leftNeighborValue <= AtomConst.LEFT_SAFE_INTEGER
      ? AtomConst.LEFT_SAFE_INTEGER
      : leftNeighborValue
  }

  getLeftHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return +(this.getLeftSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  }

  getRightSafeValue () {
    const rightNeighborValue = this.getRightNeighborValue()
    return rightNeighborValue >= AtomConst.RIGHT_SAFE_INTEGER
      ? AtomConst.RIGHT_SAFE_INTEGER
      : rightNeighborValue
  }

  getRightHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return +(this.getRightSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  }

  // TODO: add test
  isCloseTo ({ value }, precision = Atom.PRECISION) {
    return isCloseTo(this.value, value, precision)
  }

  // TODO: test this
  isTrapped (atom, precision = AtomConst.PRECISION) {
    return this.isCloseTo({ value: this.getLeftHalfwayValue() }, precision) &&
      this.isCloseTo({ value: this.getRightHalfwayValue() }, precision)
  }
}

Object.assign(Atom.prototype, {
  ...AtomNeighbor,
  ...AtomConnected,
  ...AtomWalk,
  ...AtomChain
})

module.exports = Atom
