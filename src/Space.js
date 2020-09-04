const SpaceConst = require('./Space.Const')
const SpaceCore = require('./Space.Core')
const SpacePrint = require('./Space.Print')
const SpaceExplore = require('./Space.Explore')

class Space {
  static PRECISION = SpaceConst.PRECISION
  static TIME_BUDGET_DEFAULT = SpaceConst.TIME_BUDGET_DEFAULT

  constructor (translation = () => 0, config = {}) {
    this.translation = translation
    this.inputs = []
    this.expectations = []
    Object.assign(this, config)
  }
}

Object.assign(Space.prototype, {
  ...SpaceCore,
  ...SpaceExplore,
  ...SpacePrint
})

module.exports = Space
