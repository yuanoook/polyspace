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

module.exports = {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber
}
