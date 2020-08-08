const math = require('./math')

const makeSolution = polyNum => x => math.poly(polyNum, x)

const lossMemory = [0, 0]
function feedback (loss) {
  lossMemory.push(loss)
}
function getDeltaLoss () {
  return math.add(lossMemory[lossMemory.length - 1], - lossMemory[lossMemory.length - 2])
}

const modelMemory = []
function init() {
  modelMemory.push([math.random(), 1])
}
function update() {
  const direction = getUpdateDirection()
  const currentPolyNumbers = getCurrentPolyNumbers()
  modelMemory.push([
    math.add(currentPolyNumbers[0], 0.1 * direction),
    currentPolyNumbers[1]
  ])
}
function getDeltaX () {
  return math.add(modelMemory[modelMemory.length - 1][0], - modelMemory[modelMemory.length - 2][0])
}
function getUpdateDirection () {
  if (modelMemory.length === 1) return 1

  const deltaX = getDeltaX()
  if (deltaX === 0) return 1

  const deltaLoss = getDeltaLoss()
  return deltaLoss ? math.divide(-deltaLoss, deltaX) : 1
}
function getCurrentPolyNumbers () {
  return modelMemory[modelMemory.length - 1]
}

function get () {
  return makeSolution(getCurrentPolyNumbers())
}

function solve(input) {
  return get()(input)
}

module.exports = {
  modelMemory,
  lossMemory,
  init,
  update,
  solve,
  feedback,
  getCurrentPolyNumbers
}