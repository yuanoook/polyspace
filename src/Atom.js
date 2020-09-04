const {
  randomDistanceRatio,
  validateDistanceRatio,
  randomNaturalNumber,
  randomSafeNumber,
  repeat,
  isCloseTo
} = require('./utils')

class Atom {
  static PRECISION = 6
  static LEFT_INFINITY = -Infinity
  static RIGHT_INFINITY = Infinity
  // Add config boundary :D
  static LEFT_SAFE_INTEGER = Number.MIN_SAFE_INTEGER
  static RIGHT_SAFE_INTEGER = Number.MAX_SAFE_INTEGER
  static DISTANCE_RATIO_HALF = 0.5
  static DISTANCE_STEP_ONE = 1
  static SCALE_DEPTH_LOG2_NATURAL = Math.log2(Atom.RIGHT_SAFE_INTEGER)
  static SCALE_DEPTH_LOG2_REAL = 2 * Atom.SCALE_DEPTH_LOG2_NATURAL
  static SCALE_DEPTH_LOG2_MIN_VALUE = - Math.log2(Number.MIN_VALUE)
  static SCALE_DEPTH_LOG2 = Atom.SCALE_DEPTH_LOG2_NATURAL + Atom.SCALE_DEPTH_LOG2_MIN_VALUE

  static NEIGHBOR_COLLISION_ERROR = new Error(`Neighbor collision!`)

  constructor (value = 0, config = {}) {
    this.validateValue(value)
    this.value = value
    this.left = null
    this.right = null
    Object.assign(this, config)
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

  getLeftNeighborValue () {
    return this.left ? this.left.getValue() : Atom.LEFT_INFINITY
  }

  getLeftSafeValue () {
    const leftNeighborValue = this.getLeftNeighborValue()
    return leftNeighborValue <= Atom.LEFT_SAFE_INTEGER
      ? Atom.LEFT_SAFE_INTEGER
      : leftNeighborValue
  }

  getLeftHalfwayValue (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return +(this.getLeftSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  }

  getRightNeighborValue () {
    return this.right ? this.right.getValue() : Atom.RIGHT_INFINITY
  }

  getRightSafeValue () {
    const rightNeighborValue = this.getRightNeighborValue()
    return rightNeighborValue >= Atom.RIGHT_SAFE_INTEGER
      ? Atom.RIGHT_SAFE_INTEGER
      : rightNeighborValue
  }

  getRightHalfwayValue (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return +(this.getRightSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  }

  findLeftNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 1)
    const leftHalfwayValue = this.getLeftHalfwayValue(distanceRatio)
    return this.connectLeftNeighbor(new Atom(leftHalfwayValue))
  }

  findRightNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 1)
    const rightHalfwayValue = this.getRightHalfwayValue(distanceRatio)
    return this.connectRightNeighbor(new Atom(rightHalfwayValue))
  }

  findBiNeighbors () {
    const neighbors = []

    const leftValue = this.getLeftHalfwayValue()
    if (leftValue < this.value &&
      (!this.left || leftValue !== this.left.value)
    ) neighbors.push(
      this.connectLeftNeighbor(new Atom(leftValue))
    )
    const rightValue = this.getRightHalfwayValue()
    if (rightValue > this.value &&
      (!this.right || rightValue !== this.right.value)
    ) neighbors.push(
      this.connectRightNeighbor(new Atom(rightValue))
    )

    return neighbors
  }

  findNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 0)
    return distanceRatio > 0
      ? this.findRightNeighbor(distanceRatio)
      : this.findLeftNeighbor(Math.abs(distanceRatio))
  }

  findRandomNeighbor () {
    return this.findNeighbor(randomDistanceRatio())
  }

  findRandomNeighbors (count = 1) {
    return repeat(() => this.findRandomNeighbor(), count)
  }

  isLeftNeighbor (atom) {
    return this.left === atom && atom.right === this
  }

  isRightNeighbor (atom) {
    return this.right === atom && atom.left === this
  }

  isNeighbor (atom) {
    return this.isLeftNeighbor(atom) || this.isRightNeighbor(atom)
  }

  gotoRandomNeighbor () {
    if (this.left === null && this.right === null)
      throw new Error(`gotoRandomNeighbor: no neighbor!`)
    if (this.left === null) return this.right
    if (this.right === null) return this.left
    return Math.random() < 0.5 ? this.left : this.right
  }

  // TODO: test this
  newNeighborCollisionCheck (atom) {
    if (this.value === atom.value) throw Atom.NEIGHBOR_COLLISION_ERROR
  }

  // TODO: add test
  isCloseTo ({ value }, precision = Atom.PRECISION) {
    return isCloseTo(this.value, value, precision)
  }

  // TODO: test this
  isTrapped (atom, precision = Atom.PRECISION) {
    return this.isCloseTo({ value: this.getLeftHalfwayValue() }, precision) &&
      this.isCloseTo({ value: this.getRightHalfwayValue() }, precision)
  }

  connectLeftNeighbor (newNeighbor) {
    this.newNeighborCollisionCheck(newNeighbor)
    const exLeftNeighbor = this.left

    this.left = newNeighbor
    newNeighbor.right = this

    newNeighbor.left = exLeftNeighbor
    if (exLeftNeighbor) exLeftNeighbor.right = newNeighbor

    return newNeighbor
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

module.exports = Atom
