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

function diffNomials (n1, n2) {
  return repeat(i => {
    const n1i = n1[i] === undefined ? 0 : n1[i]
    const n2i = n2[i] === undefined ? 0 : n2[i]
    return n2i - n1i
  }, Math.max(n1.length, n2.length))
}

function isSameNomials (n1, n2) {
  return euclideanDistance (n1, n2) === 0
}

function euclideanDistance (n1, n2) {
  let sum = 0
  repeat(i => {
    const n1i = n1[i] === undefined ? 0 : n1[i]
    const n2i = n2[i] === undefined ? 0 : n2[i]
    return sum += (n2i - n1i) ** 2
  }, Math.max(n1.length, n2.length))
  return Math.sqrt(sum)
}

module.exports = {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber,
  repeat,
  diffNomials,
  isSameNomials,
  euclideanDistance
}
