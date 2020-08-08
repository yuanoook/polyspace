const math = require('./math')

const makeSolution = polyNum => x => math.poly(polyNum, x)
const learningRate = 0.2

let adjustIndex = 0
const improveThreshold = 0.00000000001
const lossMemory = [0, 0]
const loss3MSE = []
function canYouDoBetter (loss) {
  lossMemory.push(loss)
  loss3MSE.push(math.std(lossMemory.slice(-3)))

  if (lossMemory.length < 4) return true
  if (lossIsZero()) return false
  if (loss3MseIsZero()) adjustIndex++

  return true
}
function lossIsZero () {
  return math.almostEqual(lossMemory.slice(-1)[0], 0, improveThreshold)
}
function loss3MseIsZero () {
  return math.almostEqual(loss3MSE.slice(-1)[0], 0, improveThreshold)
}

function getDeltaLoss () {
  return math.add(
    lossMemory[lossMemory.length - 1],
    -lossMemory[lossMemory.length - 2]
  )
}

const modelMemory = [[]]
function update() {
  const direction = getSlope()
  const currentPolyNumbers = getCurrentPolyNumbers()
  const newPolyNum = [...currentPolyNumbers]
  if (adjustIndex >= newPolyNum.length) {
    newPolyNum[adjustIndex] = math.random()
  }

  // newPolyNum[adjustIndex] = math.add(
  //   typeof newPolyNum[adjustIndex] === 'number' || math.random(),
  //   learningRate * direction
  // )
  newPolyNum[adjustIndex] = math.add(
    newPolyNum[adjustIndex],
    learningRate * direction
  )
  modelMemory.push(newPolyNum)
}

function getDeltaX () {
  const currentX = modelMemory[modelMemory.length - 1][adjustIndex]
  const previousX = modelMemory[modelMemory.length - 2][adjustIndex]
  return math.add((currentX || 0), - (previousX || 0))
}
function getSlope () {
  if (modelMemory.length <= 1) return 1

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
  update,
  solve,
  canYouDoBetter,
  getCurrentPolyNumbers
}