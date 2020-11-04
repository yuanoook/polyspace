const {
  isCloseIn
} = require('../utils')
const AtomConst = require('./Atom.Const')

module.exports = {
  getValue () {
    return this.value
  },

  forceOffsetValue (offset) {
    if (this.left || this.right) throw new Error(`Cannot force offset value!`)

    let newValue = this.value + offset
    newValue = Math.min(this.rightLimit, newValue)
    newValue = Math.max(this.leftLimit, newValue)
    newValue = this.roundUp(newValue)

    this.value = newValue
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
  },

  shakeOffLeft () {
    if (this.left) {
      this.left.right = null
      this.left = null
    }
  },

  shakeOffRight () {
    if (this.right) {
      this.right.left = null
      this.right = null
    }
  },

  shakeOff () {
    this.shakeOffLeft()
    this.shakeOffRight()
  }
}
