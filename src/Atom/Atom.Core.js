const {
  isCloseIn
} = require('../utils')
const AtomConst = require('./Atom.Const')

module.exports = {
  getValue () {
    return this.value
  },

  isIntegerUnit () {
    return this.baseUnit % 1 === 0
  },

  isFractionUnit () {
    return this.baseUnit % 1 !== 0
  },

  roundUp (value) {
    if (this.isFractionUnit()) return value
    return this.value + Math.round((value - this.value) / this.baseUnit) * this.baseUnit
  },

  getLeftSafeValue () {
    const leftNeighborValue = this.getLeftNeighborValue()
    return leftNeighborValue <= this.leftLimit
      ? this.leftLimit
      : leftNeighborValue
  },

  getLeftHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return !this.left
      ? this.leftLimit
      : + this.roundUp(
        this.getLeftSafeValue() * distanceRatio +
        this.getValue() * (1 - distanceRatio)
      )
  },

  getRightSafeValue () {
    const rightNeighborValue = this.getRightNeighborValue()
    return rightNeighborValue >= this.rightLimit
      ? this.rightLimit
      : rightNeighborValue
  },

  getRightHalfwayValue (distanceRatio = AtomConst.DISTANCE_RATIO_HALF) {
    return !this.right
      ? this.rightLimit
      :  + this.roundUp(
        this.getRightSafeValue() * distanceRatio +
        this.getValue() * (1 - distanceRatio)
      )
  },

  isCloseIn ({ value }, baseUnit = this.baseUnit) {
    return isCloseIn(this.value, value, baseUnit)
  },

  isTrappedWithIntegerUnit () {
    return (
      this.value - (this.left ? this.left.value : this.leftLimit) <= this.baseUnit
    ) && (
      (this.right ? this.right.value : this.rightLimit) - this.value <= this.baseUnit
    )
  },

  isTrappedWithFractionUnit () {
    return this.isCloseIn({ value: this.getLeftHalfwayValue() }) &&
      this.isCloseIn({ value: this.getRightHalfwayValue() })
  },

  isTrapped () {
    return this.isIntegerUnit()
      ? this.isTrappedWithIntegerUnit()
      : this.isTrappedWithFractionUnit()
  }
}
