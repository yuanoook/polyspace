const Atom = require('./Atom')
const {
  repeat
} = require('./utils')

class Point {
  constructor (nomials = []) {
    this.atoms = nomials.map(value => new Atom(value))
  }
  getAtom (index) {
    this.checkIndex(index)
    return this.atoms[index]
  }
  getAtoms () {
    return this.atoms
  }
  getNomial (index) {
    this.checkIndex(index)
    return this.atoms[index].getValue()
  }
  getNomials () {
    return this.atoms.map(atom => atom.getValue())
  }
  getDimensions () {
    return this.atoms.length
  }
  checkIndex (index) {
    return this.checkDimension(index + 1)
  }
  checkDimension (dimension) {
    if (this.getDimensions() < dimension) this.extendDimension(dimension)
  }
  extendDimension (dimension) {
    repeat(index => this.fillIndexWithZeroAtom(index), dimension)
  }
  fillIndexWithZeroAtom (index) {
    this.atoms[index] = this.atoms[index] || new Atom()
  }

  // TODO: finish this and find test
  findLeftNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.checkIndex(index)
  }

  findRightNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.checkIndex(index)
  }

  findNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.checkIndex(index)
  }
}

module.exports = Point
