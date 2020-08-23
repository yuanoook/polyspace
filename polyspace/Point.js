const Atom = require('./Atom')
const {
  randomDistanceRatio,
  randomPositiveDistanceRatio,
  randomNaturalNumber,
  randomSafeNumber,
  randomPositiveSafeNumber,
  repeat,
  isCloseTo,
  isSameNomials,
  euclideanDistance
} = require('./utils')

class Point {
  static PRECISION = 6
  constructor (nomials = [], config = {}) {
    this.atoms = nomials.map(value => this.makeAtom(value))
    Object.assign(this, config)
  }
  makeAtom (value = 0) {
    return new Atom(value, {parent: this})
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
  map (call) {
    return this.atoms.map(call)
  }
  reduce (call, init) {
    return this.atoms.reduce(call, init)
  }
  getNomials () {
    return this.map(atom => atom.getValue())
  }
  getDimensions () {
    return this.atoms.length
  }
  checkIndex (index) {
    return this.checkDimension(index + 1)
  }
  getRandomIndex () {
    return randomNaturalNumber(this.atoms.length)
  }
  checkDimension (dimension) {
    if (this.getDimensions() < dimension) this.extendDimension(dimension)
  }
  extendDimension (dimension) {
    return repeat(index => this.fillZeroAtomAt(index), dimension)
  }
  // TODO: add test
  isCloseTo (point, precision = Point.PRECISION) {
    return isCloseTo(this.euclideanDistance(point), 0, precision) 
  }
  fillZeroAtomAt (index) {
    this.atoms[index] = this.atoms[index] || this.makeAtom()
  }
  copyWithAtomAt (index, atom) {
    this.checkIndex(index)
    const newPoint = new Point()
    atom.parent = newPoint
    for (let i in this.atoms) newPoint.atoms[i] = +i === +index
      ? atom
      : newPoint.makeAtom(this.atoms[i].getValue())
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

  findRandomLeftNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findLeftNeighborAt(this.getRandomIndex(), distanceRatio)
  }

  findRandomLeftNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomLeftNeighborWith(distanceRatio), count)
  }

  findRandomLeftNeighbor () {
    return this.findRandomLeftNeighborWith(randomPositiveDistanceRatio())
  }

  findRandomLeftNeighbors (count = 1) {
    return repeat(() => this.findRandomLeftNeighbor(), count)
  }

  findRandomRightNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findRightNeighborAt(this.getRandomIndex(), distanceRatio)
  }

  findRandomRightNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomRightNeighborWith(distanceRatio), count)
  }

  findRandomRightNeighbor () {
    return this.findRandomRightNeighborWith(randomPositiveDistanceRatio())
  }

  findRandomRightNeighbors (count = 1) {
    return repeat(() => this.findRandomRightNeighbor(), count)
  }

  findRandomNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findNeighborAt(this.getRandomIndex(), distanceRatio)
  }

  findRandomNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomNeighborWith(distanceRatio), count)
  }

  findRandomNeighbor () {
    return this.findRandomNeighborWith(randomDistanceRatio())
  }

  findRandomNeighbors (count = 1) {
    return repeat(() => this.findRandomNeighbor(), count)
  }

  findLeftConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findLeftConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  findRightConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findRightConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  findConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findConnected(distance)
    return this.copyWithAtomAt(index, atomConnected)
  }

  findConnectedAtWithScalar (index, value) {
    const atomConnected = this.getAtom(index).findConnectedAtScalar(value)
    return this.copyWithAtomAt(index, atomConnected)
  }

  findRandomLeftConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findLeftConnectedAt(this.getRandomIndex(), distance)
  }

  findRandomLeftConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomLeftConnectedWith(distance), count)
  }

  findRandomLeftConnected () {
    return this.findRandomLeftConnectedWith(randomPositiveSafeNumber())
  }

  findRandomLeftConnecteds (count = 1) {
    return repeat(() => this.findRandomLeftConnected(), count)
  }

  findRandomRightConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findRightConnectedAt(this.getRandomIndex(), distance)
  }

  findRandomRightConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomRightConnectedWith(distance), count)
  }

  findRandomRightConnected () {
    return this.findRandomRightConnectedWith(randomPositiveSafeNumber())
  }

  findRandomRightConnecteds (count = 1) {
    return repeat(() => this.findRandomRightConnected(), count)
  }

  findRandomConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findConnectedAt(this.getRandomIndex(), distance)
  }

  findRandomConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomConnectedWith(distance), count)
  }

  findRandomConnected () {
    return this.findRandomConnectedWith(randomSafeNumber())
  }

  findRandomConnecteds (count = 1) {
    return repeat(() => this.findRandomConnected(), count)
  }

  findRandomConnectedWithScalar (value) {
    return this.findConnectedAtWithScalar(this.getRandomIndex(), value)
  }
  getLeftChainPointsAt (index, includeSelf = false) {
    return this.getAtom(index).getLeftChainAtoms(includeSelf).map(atom => atom.parent)
  }
  getRightChainPointsAt (index, includeSelf = false) {
    return this.getAtom(index).getRightChainAtoms(includeSelf).map(atom => atom.parent)
  }
  getChainPointsAt (index, includeSelf = true) {
    return [...this.getLeftChainPointsAt(index, includeSelf), ...this.getRightChainPointsAt(index)]
  }

  // TODO: return new Points() object, add convenient methods
  getChainPoints (includeSelf = true) {
    return this.reduce(
      (points, _, index) => [...points, ...this.getChainPointsAt(index, false)],
      includeSelf ? [this] : []
    )
  }

  getInNetworkPoints (includeSelf = true) {
    const results = this.getChainPoints()
    let index = 0
    while (results[index]) {
      const point = results[index]
      point.getChainPoints(false).forEach(point => {
        if (results.indexOf(point) < 0) results.push(point)
      })
      index ++
    }
    if (!includeSelf) results.shift()
    return results
  }

  isInNetwork (point) {
    return this.getInNetworkPoints().indexOf(point) > -1
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

  euclideanDistance (point) {
    return euclideanDistance(this.getNomials(), point.getNomials())
  }
}

module.exports = Point
