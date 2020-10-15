const Atom = require('../Atom')
const {
  randomNaturalNumber,
  repeat,
  isCloseTo,
  isSameNomials,
  trimNomials,
  euclideanDistance
} = require('../utils')
const PointConst = require('./Point.Const')

module.exports = {
  makeAtom (value = 0) {
    let config = {parent: this}
    if (typeof value === 'object') {
      Object.assign(config, value)
      value = config.value || 0
      delete config.value
    }
    return new Atom(value, config)
  },

  cloneAtom(atom) {
    return atom.newAtom(atom.getValue(), {
      parent: this
    })
  },

  getAtom (index) {
    this.checkIndex(index)
    return this.atoms[index]
  },

  getAtoms () {
    return this.atoms
  },

  getNomial (index) {
    this.checkIndex(index)
    return this.atoms[index].getValue()
  },

  forEach (call) {
    return this.atoms.forEach(call)
  },

  map (call) {
    return this.atoms.map(call)
  },

  reduce (call, init) {
    return this.atoms.reduce(call, init)
  },

  collect (call, init = []) {
    return this.reduce((list, atom, index) => list.concat(call(atom, index)), init)
  },

  getNomials () {
    return this.map(atom => atom.getValue())
  },

  getTrimmedNomials (precision = PointConst.PRECISION) {
    return trimNomials(this.getNomials(), precision)
  },

  getDimensions () {
    return this.atoms.length
  },

  checkIndex (index) {
    return this.checkDimension(index + 1)
  },

  getRandomIndex () {
    return randomNaturalNumber(this.atoms.length)
  },

  checkDimension (dimension) {
    if (this.getDimensions() < dimension) this.extendDimension(dimension)
  },

  extendDimension (dimension, nomial = 0) {
    repeat(index => this.fillAtomAt(index, nomial), dimension)
    return this
  },

  // TODO: add test
  isCloseTo (point, precision = PointConst.PRECISION) {
    return isCloseTo(this.euclideanDistance(point), 0, precision) 
  },

  fillAtomAt (index, nomial = 0) {
    this.atoms[index] = this.atoms[index] || this.makeAtom()
  },

  cloneWithNewAtomAt (index, atom) {
    this.checkIndex(index)
    const newPoint = this.newPoint()
    atom.parent = newPoint
    for (let i in this.atoms) newPoint.atoms[i] = +i === +index
      ? atom
      : newPoint.cloneAtom(this.atoms[i])
    return newPoint
  },

  isSame (point) {
    return isSameNomials(this.getNomials(), point.getNomials())
  },

  isTrapped () {
    return !this.atoms.some(atom => !atom.isTrapped())
  },

  euclideanDistance (point) {
    return euclideanDistance(this.getNomials(), point.getNomials())
  },

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
  },

  getDirection (point, baseIndex = 0) {
    let baseDivisor
    return repeat(
      i => {
        const thisIndexValue = this.atoms[i] ? this.atoms[i].value : 0
        const pointIndexValue = point.atoms[i] ? point.atoms[i].value : 0
        const distanceAtIndex = pointIndexValue - thisIndexValue
        if (baseIndex === i) baseDivisor = Math.abs(distanceAtIndex || 1)
        return distanceAtIndex
      },
      Math.max(this.atoms.length, point.atoms.length)
    ).map(distance => distance / baseDivisor)
  }
}
