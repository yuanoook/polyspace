const Atom = require('../Atom')
const {
  randomSafeNumber,
  randomPositiveSafeNumber,
  repeat
} = require('../shared/utils')

module.exports = {
  findLeftConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findLeftConnected(distance)
    return this.cloneWithNewAtomAt(index, atomConnected)
  },

  findRightConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findRightConnected(distance)
    return this.cloneWithNewAtomAt(index, atomConnected)
  },

  findConnectedAt (index, distance = Atom.DISTANCE_STEP_ONE) {
    const atomConnected = this.getAtom(index).findConnected(distance)
    return this.cloneWithNewAtomAt(index, atomConnected)
  },

  findConnectedAtWithScalar (index, value) {
    const atomConnected = this.getAtom(index).findConnectedAtScalar(value)
    return this.cloneWithNewAtomAt(index, atomConnected)
  },

  findRandomLeftConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findLeftConnectedAt(this.getRandomIndex(), distance)
  },

  findRandomLeftConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomLeftConnectedWith(distance), count)
  },

  findRandomLeftConnected () {
    return this.findRandomLeftConnectedWith(randomPositiveSafeNumber())
  },

  findRandomLeftConnecteds (count = 1) {
    return repeat(() => this.findRandomLeftConnected(), count)
  },

  findRandomRightConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findRightConnectedAt(this.getRandomIndex(), distance)
  },

  findRandomRightConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomRightConnectedWith(distance), count)
  },

  findRandomRightConnected () {
    return this.findRandomRightConnectedWith(randomPositiveSafeNumber())
  },

  findRandomRightConnecteds (count = 1) {
    return repeat(() => this.findRandomRightConnected(), count)
  },

  findRandomConnectedWith (distance = Atom.DISTANCE_STEP_ONE) {
    return this.findConnectedAt(this.getRandomIndex(), distance)
  },

  findRandomConnectedsWith (distance = Atom.DISTANCE_STEP_ONE, count = 1) {
    return repeat(() => this.findRandomConnectedWith(distance), count)
  },

  findRandomConnected () {
    return this.findRandomConnectedWith(randomSafeNumber())
  },

  findRandomConnecteds (count = 1) {
    return repeat(() => this.findRandomConnected(), count)
  },

  findRandomConnectedWithScalar (value) {
    return this.findConnectedAtWithScalar(this.getRandomIndex(), value)
  },

  checkConnected (point) {
    const connectedAtoms = this.checkoutMatchAtoms(point, Atom.prototype.isConnected)
    if (connectedAtoms.length > 1)
      throw new Error(`checkConnected: connectedAtoms are more than 2 - ${connectedAtoms.length}`)
    return connectedAtoms[0]
  },

  isLeftConnected (point) {
    const connectedInfo = this.checkConnected(point)
    if (!connectedInfo) return false
    const [atom, index] = connectedInfo
    return atom.isLeftConnected(point.atoms[index])
  },

  isRightConnected (point) {
    const connectedInfo = this.checkConnected(point)
    if (!connectedInfo) return false
    const [atom, index] = connectedInfo
    return atom.isRightConnected(point.atoms[index])
  },

  isConnected (point) {
    return !!this.checkConnected(point)
  }
}
