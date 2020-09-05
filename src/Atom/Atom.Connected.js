const {
  randomNaturalNumber,
  randomSafeNumber,
  repeat
} = require('../utils')
const AtomConst = require('./Atom.Const')

module.exports = {
  findLeftConnected (distance = AtomConst.DISTANCE_STEP_ONE) {
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
  },

  findRightConnected (distance = AtomConst.DISTANCE_STEP_ONE) {
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
  },

  findConnected (distance = AtomConst.DISTANCE_STEP_ONE) {
    if (distance === 0) throw new Error(`findConnected ${distance}`)

    return distance > 0
      ? this.findRightConnected(distance)
      : this.findLeftConnected(Math.abs(distance))
  },

  findConnectedAtScalar (value) {
    this.validateValue(value)
    return this.findConnected(value - this.getValue())
  },

  findConnectedsAtScalars (values) {
    return values.map(value => this.findConnectedAtScalar(value))
  },

  isLeftConnected (atom) {
    return this.walkLeftUntil(left => left === atom)
  },

  isRightConnected (atom) {
    return this.walkRightUntil(right => right === atom)
  },

  isConnected (atom) {
    return this.isLeftConnected(atom) || this.isRightConnected(atom)
  },

  findRandomConnected () {
    return this.findConnectedAtScalar(randomSafeNumber())
  },

  findRandomConnecteds (count = 1) {
    return repeat(() => this.findRandomConnected(), count)
  },

  gotoRandomConnected () {
    const chainAtoms = this.getChainAtoms()
    if (chainAtoms.length === 1) throw new Error(`gotoRandomConnected: There's only one atom!`)
    while (true) {
      const result = chainAtoms[randomNaturalNumber(chainAtoms.length)]
      if (result !== this) return result
    }
  }
}
