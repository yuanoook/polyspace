const PointConst = require('./Point.Const')
const PointCore = require('./Point.Core')
const PointNeighbor = require('./Point.Neighbor')
const PointConnected = require('./Point.Connected')
const PointChain = require('./Point.Chain')
const PointNetwork = require('./Point.Network')

class Point {
  static PRECISION = PointConst.PRECISION
  // TODO: ADD boundary & base baseUnit config
  constructor (nomials = [], config = {}) {
    this.atoms = nomials.map(value => this.makeAtom(value))
    Object.assign(this, config)
  }
  newPoint (...args) {
    return new Point(...args)
  }
}

Object.assign(Point.prototype, {
  ...PointCore,
  ...PointNeighbor,
  ...PointConnected,
  ...PointChain,
  ...PointNetwork
})

module.exports = Point
