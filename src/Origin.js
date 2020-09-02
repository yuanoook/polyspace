const Point = require('./Point')

class Origin extends Point {
  constructor () {
    super([])
  }

  setValue () {
    console.error('Banned!')
  }

  setIndex () {
    console.error('Banned!')
  }
}

module.exports = Origin
