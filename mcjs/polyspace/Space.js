const Point = require('./Point')

class Space {
  constructor (value = []) {
    this.atoms = []
    this.__setAtoms (value)
  }

  // @private
  __setAtoms (scalars) {
    this.atoms.length = 0
    for (let index in scalars)
      this.setIndex(index, scalars[index])
  }

  setValue (value) {
    this.__setAtoms(value)
  }

  getValue () {
    return this.atoms.map(atom => atom.getValue())
  }

  setIndex (index, value) {
    this.atoms[index] = new Atom(value)
  }

  getIndex (index) {
    const atom = this.atoms[index]
    return atom ? atom.getValue() : 0
  }
}

module.exports = Space
