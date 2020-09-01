function sum(...args) {
  return [].concat(...args).reduce((s, n) => s + n, 0)
}

function generateSmoothLog(log, radius = 0) {
  return index => {
    const start = Math.max(index - radius, 0)
    const end = Math.max(Math.min(index + radius + 1, log.length), 1)
    const samples = log.slice(start, end)
    const samplesSum = sum(samples)
    return samplesSum / samples.length
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
    const prediction = (predictTimes + 1) * smoothLog(index) - predictTimes * smoothLog(index - predictBaseStep)
    return [predictIndex, prediction]
  }
}

function trekkingErrorTranslation(nomials) {
  return log => totalTrekkingError(nomials, log)
}

function totalTrekkingError(nomials, log) {
  return sum(allTrekkingError(nomials, log))
}

function allTrekkingError(nomials, log) {
  return log.map((...args) => trekkingError(nomials, ...args))
}

function trekkingError([smoothRadius, predictBaseStep, predictTimes], _, index, log) {
  const trekking = generateTrekking(log, smoothRadius, predictBaseStep, predictTimes)
  const [predictIndex, prediction] = trekking(index)
  const expectationIndex = Math.min(predictIndex, log.length - 1)
  const expectation = log[expectationIndex]
  return (prediction - expectation) ** 2
}

function parseTrekkingLog(log) {
  return log.split('\n').map(
    record => record.split('\t').map(n => +n)
  )
}

module.exports = {
  sum,
  generateSmoothLog,
  generateTrekking,
  parseTrekkingLog,
  allTrekkingError,
  totalTrekkingError,
  trekkingError,
  trekkingErrorTranslation
}
