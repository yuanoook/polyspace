const {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber,
  repeat
} = require('./utils')

class Atom {
  static LEFT_INFINITY = -Infinity
  static RIGHT_INFINITY = Infinity
  static LEFT_SAFE_INTEGER = Number.MIN_SAFE_INTEGER
  static RIGHT_SAFE_INTEGER = Number.MAX_SAFE_INTEGER
  static DISTANCE_RATIO_HALF = 0.5
  static DISTANCE_STEP_ONE = 1

  constructor (value = 0) {
    this.validateValue(value)
    this.value = value
    this.left = null
    this.right = null
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
    return this.getLeftSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio) 
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
    return this.getRightSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio) 
  }

  findLeftNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    const leftHalfwayValue = this.getLeftHalfwayValue(distanceRatio)
    return this.connectLeftNeighbor(new Atom(leftHalfwayValue))
  }

  findRightNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    const rightHalfwayValue = this.getRightHalfwayValue(distanceRatio)
    return this.connectRightNeighbor(new Atom(rightHalfwayValue))
  }

  findNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    return distanceRatio > 0
      ? this.findRightNeighbor(distanceRatio)
      : this.findLeftNeighbor(Math.abs(distanceRatio))
  }

  findRandomNeighbor () {
    return this.findNeighbor(generateRandomDistanceRatio())
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

  validateDistanceRatio (distanceRatio) {
    if (distanceRatio === 0 ||
      distanceRatio <= -1 ||
      distanceRatio >= 1
    ) throw new Error(`-1 < DistanceRatio(!==0) < 1. We get ${distanceRatio}`)
  }

  connectLeftNeighbor (newNeighbor) {
    const exLeftNeighbor = this.left

    this.left = newNeighbor
    newNeighbor.right = this

    newNeighbor.left = exLeftNeighbor
    if (exLeftNeighbor) exLeftNeighbor.right = newNeighbor

    return newNeighbor
  }

  connectRightNeighbor (newNeighbor) {
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

  findConnectedAtValue (value) {
    this.validateValue(value)
    return this.findConnected(value - this.getValue())
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
    return this.findConnectedAtValue(generateRandomSafeNumber())
  }

  findRandomConnecteds (count = 1) {
    return repeat(() => this.findRandomConnected(), count)
  }

  gotoRandomConnected () {
    const chainAtoms = this.getChainAtoms()
    if (chainAtoms.length === 1) throw new Error(`gotoRandomConnected: There's only one atom!`)
    while (true) {
      const result = chainAtoms[generateRandomNaturalNumber(chainAtoms.length)]
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

  getChainAtoms () {
    const results = [this]

    let left = this
    while (left = left.left) results.unshift(left)

    let right = this
    while (right = right.right) results.push(right)

    return results
  }

  getChainValues () {
    return this.getChainAtoms().map(atom => atom.getValue())
  }
}

module.exports = Atom
