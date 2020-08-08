const math = require('./math')

const makeSolution = polyNum => x => math.poly(polyNum, x)

const lossMemory = [0, 0]
function feedback (loss) {
  lossMemory.push(loss)
  return getImprovability()
}
function getImprovability () {
  if (lossMemory.length < 3) return 1
  return math.stick(math.std(lossMemory.slice(-3)), 1, 0.00000000001)
}

function getDeltaLoss () {
  return math.add(
    lossMemory[lossMemory.length - 1],
    -lossMemory[lossMemory.length - 2]
  )
}

const modelMemory = []
function init() {
  modelMemory.push([math.random(), 1])
}
function update() {
  const direction = getSlope()
  const currentPolyNumbers = getCurrentPolyNumbers()
  modelMemory.push([
    math.add(currentPolyNumbers[0], 0.1 * direction),
    currentPolyNumbers[1]
  ])
}
let adjustIndex = 0
function getDeltaX () {
  return math.add(
    modelMemory[modelMemory.length - 1][adjustIndex],
    - modelMemory[modelMemory.length - 2][adjustIndex]
  )
}
function getSlope () {
  if (modelMemory.length === 1) return 1

  const deltaX = getDeltaX()
  if (deltaX === 0) return 1

  const deltaLoss = getDeltaLoss()
  return deltaLoss ? -math.divide(deltaLoss, deltaX) : 1
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
  getCurrentPolyNumbers,
  getImprovability
}