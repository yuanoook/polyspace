const Atom = require('../Atom')
const {
  randomDistanceRatio,
  randomPositiveDistanceRatio,
  repeat
} = require('../utils')

module.exports = {
  findLeftNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findLeftNeighbor(distanceRatio)
    return this.cloneWithNewAtomAt(index, atomNeighbor)
  },

  findRightNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findRightNeighbor(distanceRatio)
    return this.cloneWithNewAtomAt(index, atomNeighbor)
  },

  findNeighborAt (index, distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    const atomNeighbor = this.getAtom(index).findNeighbor(distanceRatio)
    return this.cloneWithNewAtomAt(index, atomNeighbor)
  },

  findBiNeighborsAt (index, direction) {
    global.xcount = global.xcount || 0
    global.xcount ++
    if (global.xcount === 50) {
      console.log(direction)
    }
    const biNeighbors = this.getAtom(index).findBiNeighbors()
    return biNeighbors.map(atomNeighbor => this.cloneWithNewAtomAt(index, atomNeighbor, direction))
  },

  findBiNeighbors () {
    return this.collect((_, index) => this.findBiNeighborsAt(index))
  },

  findBiNeighborsMatrix (direction) {
    return this.collect((_, index) => [this.findBiNeighborsAt(index, direction)])
  },

  // TODO: add test
  getBiNeighborsAt (index) {
    const atom = this.getAtom(index)
    let neighbors = []
    if (atom.left) neighbors.push(atom.left.parent)
    if (atom.right) neighbors.push(atom.right.parent)
    return neighbors
  },

  getBiNeighbors () {
    return this.collect((atom, index) => this.getBiNeighborsAt(index))
  },

  getNeighbors (depth = 1) {
    if (depth < 1) return []
    const biNeighbors = this.getBiNeighbors()

    const secondNeighbors = biNeighbors.reduce((neighbors, biNeighbor) =>
      neighbors.concat(
        biNeighbor.getNeighbors(depth - 1).filter(n => n !== this)
    ), [])

    return [...new Set(biNeighbors.concat(secondNeighbors))]
  },

  findRandomNeighborAt (index) {
    const atomNeighbor = this.getAtom(index).findRandomNeighbor()
    return this.cloneWithNewAtomAt(index, atomNeighbor)
  },

  findRandomNeighborsAt (index, count = 1) {
    const atomNeighbors = this.getAtom(index).findRandomNeighbors(count)
    return repeat(i => this.cloneWithNewAtomAt(index, atomNeighbors[i]), count)
  },

  findRandomLeftNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findLeftNeighborAt(this.getRandomIndex(), distanceRatio)
  },

  findRandomLeftNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomLeftNeighborWith(distanceRatio), count)
  },

  findRandomLeftNeighbor () {
    return this.findRandomLeftNeighborWith(randomPositiveDistanceRatio())
  },

  findRandomLeftNeighbors (count = 1) {
    return repeat(() => this.findRandomLeftNeighbor(), count)
  },

  findRandomRightNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findRightNeighborAt(this.getRandomIndex(), distanceRatio)
  },

  findRandomRightNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomRightNeighborWith(distanceRatio), count)
  },

  findRandomRightNeighbor () {
    return this.findRandomRightNeighborWith(randomPositiveDistanceRatio())
  },

  findRandomRightNeighbors (count = 1) {
    return repeat(() => this.findRandomRightNeighbor(), count)
  },

  findRandomNeighborWith (distanceRatio = Atom.DISTANCE_RATIO_HALF) {
    return this.findNeighborAt(this.getRandomIndex(), distanceRatio)
  },

  findRandomNeighborsWith (distanceRatio = Atom.DISTANCE_RATIO_HALF, count = 1) {
    return repeat(() => this.findRandomNeighborWith(distanceRatio), count)
  },

  findRandomNeighbor () {
    return this.findRandomNeighborWith(randomDistanceRatio())
  },

  findRandomNeighbors (count = 1) {
    return repeat(() => this.findRandomNeighbor(), count)
  },

  checkNeighbor (point) {
    const neighborAtoms = this.checkoutMatchAtoms(point, Atom.prototype.isNeighbor)
    if (neighborAtoms.length > 1)
      throw new Error(`checkNeighbor: neighborAtoms are more than 2 - ${neighborAtoms.length}`)
    return neighborAtoms[0]
  },

  isLeftNeighbor (point) {
    const neighborInfo = this.checkNeighbor(point)
    if (!neighborInfo) return false
    const [atom, index] = neighborInfo
    return atom.isLeftNeighbor(point.atoms[index])
  },

  isRightNeighbor (point) {
    const neighborInfo = this.checkNeighbor(point)
    if (!neighborInfo) return false
    const [atom, index] = neighborInfo
    return atom.isRightNeighbor(point.atoms[index])
  },

  isNeighbor (point) {
    return !!this.checkNeighbor(point)
  },

  printNeighborsAt (index, log = true) {
    const atom = this.getAtom(index)
    const result = [
      atom.left && atom.left.parent,
      atom.right && atom.right.parent
    ].filter(atomNeighbor => atomNeighbor)
     .map(point => point.getTrimmedNomials(0))
     .filter(nomials => nomials.length)

    if (log && result.length) console.log(JSON.stringify(result, null, 2))
    return result
  },

  printNeighbors (log = true) {
    return this.map((_, index) => this.printNeighborsAt(index, log))
      .filter(neighbors => neighbors.length)
  }
}
