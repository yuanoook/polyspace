const {
  randomDistanceRatio,
  validateDistanceRatio,
  repeat
} = require('./utils')
const AtomConst = require('./Atom.Const')

module.exports = {
  getLeftNeighborValue () {
    return this.left ? this.left.getValue() : AtomConst.LEFT_INFINITY
  },

  getLeftSafeValue () {
    const leftNeighborValue = this.getLeftNeighborValue()
    return leftNeighborValue <= AtomConst.LEFT_SAFE_INTEGER
      ? AtomConst.LEFT_SAFE_INTEGER
      : leftNeighborValue
  },

  getLeftHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return +(this.getLeftSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  },

  getRightNeighborValue () {
    return this.right ? this.right.getValue() : AtomConst.RIGHT_INFINITY
  },

  getRightSafeValue () {
    const rightNeighborValue = this.getRightNeighborValue()
    return rightNeighborValue >= AtomConst.RIGHT_SAFE_INTEGER
      ? AtomConst.RIGHT_SAFE_INTEGER
      : rightNeighborValue
  },

  getRightHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return +(this.getRightSafeValue() * distanceRatio +
      this.getValue() * (1 - distanceRatio)) // .toFixed(2)
  },

  findLeftNeighbor (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 1)
    const leftHalfwayValue = this.getLeftHalfwayValue(distanceRatio)
    return this.connectLeftNeighbor(this.newAtom(leftHalfwayValue))
  },

  findRightNeighbor (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 1)
    const rightHalfwayValue = this.getRightHalfwayValue(distanceRatio)
    return this.connectRightNeighbor(this.newAtom(rightHalfwayValue))
  },

  findBiNeighbors () {
    const neighbors = []

    const leftValue = this.getLeftHalfwayValue()
    if (leftValue < this.value &&
      (!this.left || leftValue !== this.left.value)
    ) neighbors.push(
      this.connectLeftNeighbor(this.newAtom(leftValue))
    )
    const rightValue = this.getRightHalfwayValue()
    if (rightValue > this.value &&
      (!this.right || rightValue !== this.right.value)
    ) neighbors.push(
      this.connectRightNeighbor(this.newAtom(rightValue))
    )

    return neighbors
  },

  findNeighbor (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    validateDistanceRatio(distanceRatio, 0)
    return distanceRatio > 0
      ? this.findRightNeighbor(distanceRatio)
      : this.findLeftNeighbor(Math.abs(distanceRatio))
  },

  findRandomNeighbor () {
    return this.findNeighbor(randomDistanceRatio())
  },

  findRandomNeighbors (count = 1) {
    return repeat(() => this.findRandomNeighbor(), count)
  },

  isLeftNeighbor (atom) {
    return this.left === atom && atom.right === this
  },

  isRightNeighbor (atom) {
    return this.right === atom && atom.left === this
  },

  isNeighbor (atom) {
    return this.isLeftNeighbor(atom) || this.isRightNeighbor(atom)
  },

  gotoRandomNeighbor () {
    if (this.left === null && this.right === null)
      throw new Error(`gotoRandomNeighbor: no neighbor!`)
    if (this.left === null) return this.right
    if (this.right === null) return this.left
    return Math.random() < 0.5 ? this.left : this.right
  },

  // TODO: test this
  newNeighborCollisionCheck (atom) {
    if (this.value === atom.value) throw AtomConst.NEIGHBOR_COLLISION_ERROR
  },

  // TODO: test this
  isTrapped (atom, precision = AtomConst.PRECISION) {
    return this.isCloseTo({ value: this.getLeftHalfwayValue() }, precision) &&
      this.isCloseTo({ value: this.getRightHalfwayValue() }, precision)
  },

  connectLeftNeighbor (newNeighbor) {
    this.newNeighborCollisionCheck(newNeighbor)
    const exLeftNeighbor = this.left

    this.left = newNeighbor
    newNeighbor.right = this

    newNeighbor.left = exLeftNeighbor
    if (exLeftNeighbor) exLeftNeighbor.right = newNeighbor

    return newNeighbor
  },

  connectRightNeighbor (newNeighbor) {
    this.newNeighborCollisionCheck(newNeighbor)
    const exRightNeighbor = this.right

    this.right = newNeighbor
    newNeighbor.left = this

    newNeighbor.right = exRightNeighbor
    if (exRightNeighbor) exRightNeighbor.left = newNeighbor

    return newNeighbor
  }
}
