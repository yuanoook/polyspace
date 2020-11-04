module.exports = {
  getLeftChainAtoms (includeSelf = false) {
    const results = includeSelf ? [this] : []
    let left = this
    while (left = left.left) results.unshift(left)
    return results
  },

  getRightChainAtoms (includeSelf = false) {
    const results = includeSelf ? [this] : []
    let right = this
    while (right = right.right) results.push(right)
    return results
  },

  getChainAtoms () {
    return [...this.getLeftChainAtoms(), this, ...this.getRightChainAtoms()]
  },

  getLeftChainValues (includeSelf = false) {
    return this.getLeftChainAtoms(includeSelf).map(atom => atom.getValue())
  },

  getRightChainValues (includeSelf = false) {
    return this.getRightChainAtoms(includeSelf).map(atom => atom.getValue())
  },

  getChainValues () {
    return this.getChainAtoms().map(atom => atom.getValue())
  },
}
