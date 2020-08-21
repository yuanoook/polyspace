function randomDistanceRatio (flag = 0) {
  let ratio
  while (!ratio || ratio === -1) ratio = Math.random() * 2 - 1
  if (!flag) return ratio
  if (flag < 0) return -Math.abs(ratio)
  if (flag > 0) return Math.abs(ratio)
}

function randomNaturalNumber (upperLimit = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * upperLimit)
}

function randomSafeNumber (limit = Number.MAX_SAFE_INTEGER) {
  return randomDistanceRatio() * limit
}

function validateDistanceRatio (distanceRatio, flag = 0) {
  if (distanceRatio === 0 ||
    distanceRatio <= -1 ||
    distanceRatio >= 1
  ) throw new Error(`-1 < DistanceRatio(!==0) < 1. We get ${distanceRatio}`)

  if (!flag) return
  if (flag < 0 && distanceRatio > 0)
    throw new Error(`DistanceRatio < 0. We get ${distanceRatio}`)
  if (flag > 0 && distanceRatio < 0)
    throw new Error(`DistanceRatio > 0. We get ${distanceRatio}`)
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
  randomDistanceRatio,
  validateDistanceRatio,
  randomNaturalNumber,
  randomSafeNumber,
  repeat,
  diffNomials,
  isSameNomials,
  euclideanDistance
}
