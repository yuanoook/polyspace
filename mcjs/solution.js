const math = require('./math')

const currentPolyNumbers = [-10, 1]
const makeSolution = polyNum => x => math.poly(polyNum, x)

function update() {
  currentPolyNumbers[0] = math.add(currentPolyNumbers[0], 0.1)
}

function get () {
  return makeSolution(currentPolyNumbers)
}

function solve(input) {
  return get()(input)
}

module.exports = {
  update,
  solve
}