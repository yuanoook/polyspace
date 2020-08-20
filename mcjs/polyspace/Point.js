const Atom = require('./Atom')
const {
  repeat,
  isSameNomials
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
  copyWithAtomAtIndex (index, atom) {
    this.checkIndex(index)
    const newPoint = new Point()
    for (let i in this.atoms) newPoint.atoms[i] = +i === +index
      ? atom
      : new Atom(this.atoms[i].getValue())
    return newPoint
  }

  findLeftNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findLeftNeighbor(distanceRatio)
    return this.copyWithAtomAtIndex(index, atomNeighbor)
  }

  findRightNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findRightNeighbor(distanceRatio)
    return this.copyWithAtomAtIndex(index, atomNeighbor)
  }

  findNeighbor (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findNeighbor(distanceRatio)
    return this.copyWithAtomAtIndex(index, atomNeighbor)
  }

  checkNeighborInfo (point) {
    const neighborAtoms = repeat(
      i => {
        const thisAtom = this.atoms[i]
        const pointAtom = point.atoms[i]
        return thisAtom && pointAtom && thisAtom.isNeighbor(pointAtom)
          ? [thisAtom, i]
          : []
      },
      Math.max(this.atoms.length, point.atoms.length)
    ).filter(([x]) => x)

    if (neighborAtoms.length > 1)
      throw new Error(`checkNeighborInfo: neighborAtoms are more than 2 - ${neighborAtoms.length}`)

    return neighborAtoms
  }

  isNeighbor (point) {
    return this.checkNeighborInfo(point).length === 1
  }

  isSame (point) {
    return isSameNomials(this.getNomials(), point.getNomials())
  }
}

module.exports = Point
