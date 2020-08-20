const {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber
} = require('./utils')

class Atom {
  static LEFT_INFINITY = -Infinity
  static RIGHT_INFINITY = Infinity
  static LEFT_SAFE_INTEGER = Number.MIN_SAFE_INTEGER
  static RIGHT_SAFE_INTEGER = Number.MAX_SAFE_INTEGER
  static DISTANCE_RATIO_HALF = 0.5
  static DISTANCE_STEP_ONE = 1

  constructor (value = 0) {
    this.setValue(value)
    this.left = null
    this.right = null
  }

  setValue (value) {
    this.validateValue(value)
    this.value = value
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

  addLeftNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    const leftHalfwayValue = this.getLeftHalfwayValue(distanceRatio)
    return this.connectLeftNeighbor(new Atom(leftHalfwayValue))
  }

  addRightNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    const rightHalfwayValue = this.getRightHalfwayValue(distanceRatio)
    return this.connectRightNeighbor(new Atom(rightHalfwayValue))
  }

  addNeighbor (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.validateDistanceRatio(distanceRatio)
    return distanceRatio > 0
      ? this.addRightNeighbor(distanceRatio)
      : this.addLeftNeighbor(Math.abs(distanceRatio))
  }

  addNeighborRandom () {
    return this.addNeighbor(generateRandomDistanceRatio())
  }

  gotoNeighborRandom () {
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

  addLeftConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance < 0) throw new Error(`AddLeftConnected ${distance}`)

    const newValue = this.value - distance
    let atom = this
    while (atom) {
      const leftValue = atom.getLeftNeighborValue()
      if (leftValue === newValue) return atom.left
      if (leftValue < newValue) return atom.connectLeftNeighbor(new Atom(newValue))
      atom = atom.left
    }
    throw new Error(`AddLeftConnected ${distance}`)
  }

  addRightConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance < 0) throw new Error(`addRightConnected ${distance}`)

    const newValue = this.value + distance
    let atom = this
    while (atom) {
      const rightValue = atom.getRightNeighborValue()
      if (rightValue === newValue) return atom.right
      if (rightValue > newValue) return atom.connectRightNeighbor(new Atom(newValue))
      atom = atom.right
    }
    throw new Error(`AddRightConnected ${distance}`)
  }

  addConnected (distance = Atom.DISTANCE_STEP_ONE) {
    if (distance === 0) throw new Error(`addConnected ${distance}`)

    return distance > 0
      ? this.addRightConnected(distance)
      : this.addLeftConnected(Math.abs(distance))
  }

  addConnectedAt (value) {
    this.validateValue(value)
    return this.addConnected(value - this.getValue())
  }

  addConnectedRandom () {
    return this.addConnectedAt(generateRandomSafeNumber())
  }

  gotoConnectedRandom () {
    const chainAtoms = this.getChainAtoms()
    return chainAtoms[generateRandomNaturalNumber(chainAtoms.length)]
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
