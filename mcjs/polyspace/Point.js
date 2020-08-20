const Atom = require('./Atom')
const {
  repeat
} = require('./utils')

class Point {
  constructor (nomials = []) {
    this.atoms = nomials.map(value => new Atom(value))
  }
  getAtom (index) {
    this.checkDimension(index)
    return this.atoms[index]
  }
  getAtoms () {
    return this.atoms
  }
  getNomial (index) {
    this.checkDimension(index)
    return this.atoms[index].getValue()
  }
  getNomials () {
    return this.atoms.map(atom => atom.getValue())
  }
  getDimensions () {
    return this.atoms.length
  }
  checkDimension (index) {
    const dimension = index + 1
    if (this.getDimensions() < dimension) this.extendDimension(dimension)
  }
  extendDimension (dimension) {
    repeat(index => this.fillIndexWithZeroAtom(index), dimension)
  }
  fillIndexWithZeroAtom (index) {
    this.atoms[index] = this.atoms[index] || new Atom()
  }

  addLeftNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    this.atoms[index]
  }

  addRightNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
  }

  addNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
  }
}

module.exports = Point
