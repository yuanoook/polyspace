function generateRandomDistanceRatio () {
  while (true) {
    const ratio = Math.random() * 2 - 1
    if (ratio && ratio !== -1) return ratio
  }
}

function generateRandomNaturalNumber (upperLimit = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * upperLimit)
}

function generateRandomSafeNumber (limit = Number.MAX_SAFE_INTEGER) {
  return generateRandomDistanceRatio() * limit
}

function repeat (call, count = 1) {
  const results = []
  while (count > 0) {
    results.push(call(results.length))
    count --
  }
  return results
}

module.exports = {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber,
  repeat
}
