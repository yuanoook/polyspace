const {
  randomNaturalNumber,
  randomSafeNumber,
  repeat,
  isCloseTo
} = require('./utils')
const AtomConst = require('./Atom.Const')
const AtomNeighbor = require('./Atom.Neighbor')

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

  newAtom (...args) {
    return new Atom(...args)
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

  // TODO: add test
  isCloseTo ({ value }, precision = Atom.PRECISION) {
    return isCloseTo(this.value, value, precision)
  }

  connectRightNeighbor (newNeighbor) {
    this.newNeighborCollisionCheck(newNeighbor)
    const exRightNeighbor = this.right

    this.right = newNeighbor
    newNeighbor.left = this

    newNeighbor.right = exRightNeighbor
    if (exRightNeighbor) exRightNeighbor.left = newNeighbor

    return newNeighbor
  }

  findLeftConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance < 0) throw new Error(`findLeftConnected ${distance}`)

    const newValue = this.value - distance
    let atom = this
    while (atom) {
      const leftValue = atom.getLeftNeighborValue()
      if (leftValue === newValue) return atom.left
      if (leftValue < newValue) return atom.connectLeftNeighbor(new Atom(newValue))
      atom = atom.left
    }
    throw new Error(`findLeftConnected ${distance}`)
  }

  findRightConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance < 0) throw new Error(`findRightConnected ${distance}`)

    const newValue = this.value + distance
    let atom = this
    while (atom) {
      const rightValue = atom.getRightNeighborValue()
      if (rightValue === newValue) return atom.right
      if (rightValue > newValue) return atom.connectRightNeighbor(new Atom(newValue))
      atom = atom.right
    }
    throw new Error(`findRightConnected ${distance}`)
  }

  findConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance === 0) throw new Error(`findConnected ${distance}`)

    return distance > 0
      ? this.findRightConnected(distance)
      : this.findLeftConnected(Math.abs(distance))
  }

  findConnectedAtScalar (value) {
    this.validateValue(value)
    return this.findConnected(value - this.getValue())
  }

  findConnectedsAtScalars (values) {
    return values.map(value => this.findConnectedAtScalar(value))
  }

  isLeftConnected (atom) {
    return this.walkLeftUntil(left => left === atom)
  }

  isRightConnected (atom) {
    return this.walkRightUntil(right => right === atom)
  }

  isConnected (atom) {
    return this.isLeftConnected(atom) || this.isRightConnected(atom)
  }

  findRandomConnected () {
    return this.findConnectedAtScalar(randomSafeNumber())
  }

  findRandomConnecteds (count = 1) {
    return repeat(() => this.findRandomConnected(), count)
  }

  gotoRandomConnected () {
    const chainAtoms = this.getChainAtoms()
    if (chainAtoms.length === 1) throw new Error(`gotoRandomConnected: There's only one atom!`)
    while (true) {
      const result = chainAtoms[randomNaturalNumber(chainAtoms.length)]
      if (result !== this) return result
    }
  }

  gotoLeftMost () {
    let left = this
    while (left.left) left = left.left
    return left
  }

  gotoRightMost () {
    let right = this
    while (right.right) right = right.right
    return right
  }

  walkLeftUntil (call, includeSelf = false) {
    let left = includeSelf ? this : this.left
    while (left) {
      const result = call(left)
      if (result) return result
      left = left.left
    }
  }

  walkToLeftMost (call, includeSelf = false) {
    let results = []
    this.walkLeftUntil(left => {
      results.push(call(left))
    }, includeSelf)
    return results
  }

  walkRightUntil (call, includeSelf = false) {
    let right = includeSelf ? this : this.right
    while (right) {
      const result = call(right)
      if (result) return result
      right = right.right
    }
  }

  walkToRightMost (call, includeSelf = false) {
    let results = []
    this.walkRightUntil(right => {
      results.push(call(right))
    }, includeSelf)
    return results
  }

  walkAllFromLeft (call) {
    return this.gotoLeftMost().walkToRightMost(call, true)
  }

  walkAllFromRight (call) {
    return this.gotoRightMost().walkToLeftMost(call, true)
  }

  getLeftChainAtoms (includeSelf = false) {
    const results = includeSelf ? [this] : []
    let left = this
    while (left = left.left) results.unshift(left)
    return results
  }

  getRightChainAtoms (includeSelf = false) {
    const results = includeSelf ? [this] : []
    let right = this
    while (right = right.right) results.push(right)
    return results
  }

  getChainAtoms () {
    return [...this.getLeftChainAtoms(), this, ...this.getRightChainAtoms()]
  }

  getLeftChainValues (includeSelf = false) {
    return this.getLeftChainAtoms(includeSelf).map(atom => atom.getValue())
  }

  getRightChainValues (includeSelf = false) {
    return this.getRightChainAtoms(includeSelf).map(atom => atom.getValue())
  }

  getChainValues () {
    return this.getChainAtoms().map(atom => atom.getValue())
  }
}

Object.assign(Atom.prototype, {
  ...AtomNeighbor
})

module.exports = Atom
