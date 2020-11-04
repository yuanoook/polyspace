module.exports = {
  getLeftChainPointsAt (index, includeSelf = false) {
    return this.getAtom(index).getLeftChainAtoms(includeSelf).map(atom => atom.parent)
  },

  getRightChainPointsAt (index, includeSelf = false) {
    return this.getAtom(index).getRightChainAtoms(includeSelf).map(atom => atom.parent)
  },

  getChainPointsAt (index, includeSelf = true) {
    return [...this.getLeftChainPointsAt(index, includeSelf), ...this.getRightChainPointsAt(index)]
  },

  // TODO: return new Points() object, add convenient methods
  getChainPoints (includeSelf = true) {
    return this.collect(
      (_, index) => this.getChainPointsAt(index, false),
      includeSelf ? [this] : [])
  },

  shakeOffChainPoints () {
    this.forEach(atom => {
      if (atom.left) atom.left.shakeOffLeft()
      if (atom.right) atom.right.shakeOffRight()
    })
  },

  shakeOff () {
    this.forEach(atom => atom.shakeOff())
  }
}
