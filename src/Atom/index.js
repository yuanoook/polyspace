const {
  validatePositive,
  validateLimits
} = require('../utils')
const AtomConst = require('./Atom.Const')
const AtomCore = require('./Atom.Core')
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

  constructor (value = 0, {
    parent,
    baseUnit = AtomConst.BASE_UNIT,
    leftLimit = AtomConst.LEFT_SAFE_INTEGER,
    rightLimit = AtomConst.RIGHT_SAFE_INTEGER
  } = {}) {
    this.left = null
    this.right = null
    this.parent = parent

    if (value === -9007199254740991) {
      console.log(baseUnit)
      console.log(leftLimit)
      console.log(rightLimit)
      throw new Error(value)
    }

    validatePositive(baseUnit)
    this.baseUnit = baseUnit
    this.leftLimit = leftLimit
    this.rightLimit = rightLimit

    this.validateValue(value)
    this.value = value
  }

  newAtom (value, config) {
    return new Atom(value, {
      baseUnit: this.baseUnit,
      leftLimit: this.leftLimit,
      rightLimit: this.rightLimit,
      ...config
    })
  }

  validateValue (value) {
    return validateLimits(value, this.leftLimit, this.rightLimit)
  }
}

Object.assign(Atom.prototype, {
  ...AtomCore,
  ...AtomNeighbor,
  ...AtomConnected,
  ...AtomWalk,
  ...AtomChain
})

module.exports = Atom
