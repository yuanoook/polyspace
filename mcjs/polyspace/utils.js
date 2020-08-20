
function generateRandomDistanceRatio () {
  while (true) {
    const ratio = Math.random() * 2 - 1
    if (ratio && ratio !== -1) return ratio
  }
}

function generateRandomNatureNumber (upperLimit = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * upperLimit)
}

module.exports = {
  generateRandomDistanceRatio,
  generateRandomNatureNumber
}
