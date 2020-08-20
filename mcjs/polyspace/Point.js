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
    repeat(index => this.fillZeroAtomAt(index), dimension)
  }
  fillZeroAtomAt (index) {
    this.atoms[index] = this.atoms[index] || new Atom()
  }
  copyWithAtomAt (index, atom) {
    this.checkIndex(index)
    const newPoint = new Point()
    for (let i in this.atoms) newPoint.atoms[i] = +i === +index
      ? atom
      : new Atom(this.atoms[i].getValue())
    return newPoint
  }

  findLeftNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findLeftNeighbor(distanceRatio)
    return this.copyWithAtomAt(index, atomNeighbor)
  }

  findRightNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findRightNeighbor(distanceRatio)
    return this.copyWithAtomAt(index, atomNeighbor)
  }

  findNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findNeighbor(distanceRatio)
    return this.copyWithAtomAt(index, atomNeighbor)
  }

  findRandomNeighborAt (index) {
    const atomNeighbor = this.getAtom(index).findRandomNeighbor()
    return this.copyWithAtomAt(index, atomNeighbor)
  }

  findRandomNeighborsAt (index, count = 1) {
    const atomNeighbors = this.getAtom(index).findRandomNeighbors(count)
    return repeat(i => this.copyWithAtomAt(index, atomNeighbors[i]), count)
  }

  // TODO: add test
  findLeftConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findLeftConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  // TODO: add test
  findRightConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findRightConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  // TODO: add test
  findConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  // TODO: add test
  findConnectedAtValue (index, value) {
    const atomConnected = this.getAtom(index).findConnectedAtValue(value)
    return this.copyWithAtomAt(index, atomConnected)
  }

  // TODO: add test
  findRandomConnectedAt (index) {
    const atomConnected = this.getAtom(index).findRandomConnected()
    return this.copyWithAtomAt(index, atomConnected)
  }

  // TODO: add test
  findRandomConnectedsAt (index, count = 1) {
    const atomConnecteds = this.getAtom(index).findRandomConnecteds(count)
    return repeat(i => this.copyWithAtomAt(index, atomConnecteds[i]), count)
  }

  checkoutMatchAtoms (point, func) {
    return repeat(
      i => {
        const thisAtom = this.atoms[i]
        const pointAtom = point.atoms[i]
        return thisAtom && pointAtom && func.call(thisAtom, pointAtom)
          ? [thisAtom, i]
          : []
      },
      Math.max(this.atoms.length, point.atoms.length)
    ).filter(([x]) => x)
  }

  checkNeighbor (point) {
    const neighborAtoms = this.checkoutMatchAtoms(point, Atom.prototype.isNeighbor)
    if (neighborAtoms.length > 1)
      throw new Error(`checkNeighbor: neighborAtoms are more than 2 - ${neighborAtoms.length}`)
    return neighborAtoms[0]
  }

  checkConnected (point) {
    const connectedAtoms = this.checkoutMatchAtoms(point, Atom.prototype.isConnected)
    if (connectedAtoms.length > 1)
      throw new Error(`checkConnected: connectedAtoms are more than 2 - ${connectedAtoms.length}`)
    return connectedAtoms[0]
  }

  isLeftNeighbor (point) {
    const neighborInfo = this.checkNeighbor(point)
    if (!neighborInfo) return false
    const [atom, index] = neighborInfo
    return atom.isLeftNeighbor(point.atoms[index])
  }

  isRightNeighbor (point) {
    const neighborInfo = this.checkNeighbor(point)
    if (!neighborInfo) return false
    const [atom, index] = neighborInfo
    return atom.isRightNeighbor(point.atoms[index])
  }

  isNeighbor (point) {
    return !!this.checkNeighbor(point)
  }

  isLeftConnected (point) {
    const connectedInfo = this.checkConnected(point)
    if (!connectedInfo) return false
    const [atom, index] = connectedInfo
    return atom.isLeftConnected(point.atoms[index])
  }

  isRightConnected (point) {
    const connectedInfo = this.checkConnected(point)
    if (!connectedInfo) return false
    const [atom, index] = connectedInfo
    return atom.isRightConnected(point.atoms[index])
  }

  isConnected (point) {
    return !!this.checkConnected(point)
  }

  isSame (point) {
    return isSameNomials(this.getNomials(), point.getNomials())
  }
}

module.exports = Point
