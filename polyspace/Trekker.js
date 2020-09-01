const { 
  add2Nomials, 
  diffNomials, 
  euclideanDistance
} = require('./utils')

function sumScalar(scalarList) {
  return scalarList.reduce((a, b) => a + b, 0)
}

function sumNomials(nomialsList) {
  return nomialsList.reduce((s, n) => add2Nomials(s, n), [])
}

function divideNomials(nomials, divisor) {
  return nomials.map(scalar => scalar / divisor)
}

function meanScalar(scalarList) {
  return sumScalar(scalarList) / scalarList.length
}

function meanNomials(nomialsList) {
  return divideNomials(sumNomials(nomialsList), nomialsList.length)
}

function multiplyNomials(nomials, times) {
  return nomials.map(scalar => scalar * times)
}

function generateSmoothLog(log, radius = 0) {
  return index => {
    const start = Math.max(index - radius, 0)
    const end = Math.max(Math.min(index + radius + 1, log.length), 1)
    const samples = log.slice(start, end)
    const isScalar = !Array.isArray(log[0])
    return isScalar ? meanScalar(samples) : meanNomials(samples)
  }
}

// Numb Trek function

// F(n) = Sum(log(n-r)...log(n+r)) / (2r+1)

// F(n+m) = F(n) + [F(n) - F(n-m)]
//        = 2 * F(n) - F(n-m)

// F(n+tm) = F(n) + t[F(n) - F(n-m)]
//           (t+1) * F(n) - t * F(n-m)

// What are the best numbers for - m, t, r ?

function generateTrekking(log, smoothRadius, predictBaseStep = 1, predictTimes = 1) {
  return index => {
    const smoothLog = generateSmoothLog(log, smoothRadius)
    const predictIndex = index + predictBaseStep * predictTimes
    const isScalar = !Array.isArray(log[0])
    const prediction = isScalar
      ? (predictTimes + 1) * smoothLog(index) - predictTimes * smoothLog(index - predictBaseStep)
      : diffNomials(
        multiplyNomials(smoothLog(index - predictBaseStep), predictTimes),
        multiplyNomials(smoothLog(index), predictTimes + 1)
      )
    return [predictIndex, prediction]
  }
}

function trekkingErrorTranslation(nomials) {
  return log => totalTrekkingError(nomials, log)
}

function totalTrekkingError(nomials, log) {
  return sumScalar(allTrekkingError(nomials, log))
}

function allTrekkingError(nomials, log) {
  return log.map((...args) => trekkingError(nomials, ...args))
}

function trekkingError([smoothRadius, predictBaseStep, predictTimes], _, index, log) {
  // console.log('trekkingError: ', index)
  const trekking = generateTrekking(log, smoothRadius, predictBaseStep, predictTimes)
  const [predictIndex, prediction] = trekking(index)
  const expectationIndex = Math.min(predictIndex, log.length - 1)
  const expectation = log[expectationIndex]
  const isScalar = !Array.isArray(log[0])
  return isScalar
    ? (prediction - expectation) ** 2
    : euclideanDistance(prediction, expectation)
}

function parseTrekkingLog(log) {
  return log.split('\n').map(
    record => record.split('\t').map(n => +n)
  )
}

module.exports = {
  sumScalar,
  sumNomials,
  generateSmoothLog,
  generateTrekking,
  parseTrekkingLog,
  allTrekkingError,
  totalTrekkingError,
  trekkingError,
  trekkingErrorTranslation
}
