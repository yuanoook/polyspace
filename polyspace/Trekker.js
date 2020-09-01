function sum(...args) {
  return [].concat(...args).reduce((s, n) => s + n, 0)
}

function makeF(log, radius) {
  return index => {
    const samples = log.slice(index - radius, index + radius + 1)
    const samplesSum = sum(samples)
    return samplesSum / samples.length
  }
}

function trekking(t, m, F) {
  return (t+1) * F(n) - t * F(n-m)
}

function parseTrekkingLog(log) {
  return log.split('\n').map(
    record => record.split('\t').map(n => +n)
  )
}

module.exports = {
  sum,
  makeF,
  trekking,
  parseTrekkingLog
}
