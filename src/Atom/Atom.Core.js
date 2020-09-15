const {
  isCloseIn
} = require('../utils')
const AtomConst = require('./Atom.Const')

module.exports = {
  getValue () {
    return this.value
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
      : + (
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
      :  + (
        this.getRightSafeValue() * distanceRatio +
        this.getValue() * (1 - distanceRatio)
      )
  },

  isCloseIn ({ value }, baseUnit = this.baseUnit) {
    return isCloseIn(this.value, value, baseUnit)
  },

  isTrapped () {
    return this.isCloseIn({ value: this.getLeftHalfwayValue() }) &&
      this.isCloseIn({ value: this.getRightHalfwayValue() })
  }
}
