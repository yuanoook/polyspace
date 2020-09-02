const mathjs = require('mathjs')

const sum = (...items) => items.reduce((a, b) => a + b, 0)
const pow = (base, exponents) => base ** exponents
const multiply = (base, times) => base * times
const divide = (base, divisor) => base / divisor
const almostEqual = (a, b, threshold = 0.0001) =>
  Math.abs(a - b) <= threshold

const random = (a = 10) => a * (Math.random() - 0.5)
const mean = a => divide(sum(a), a.length)
const stickAbs = function (a, b = 1, threshold = 0.000001) {
  a = Math.abs(a)
  if (almostEqual(a % b, 0, threshold)) return (a - a % b)
  if (almostEqual(a % b, b, threshold)) return (a - a % b) + b
  return a
}
const stick = function (a, b = 1, threshold = 0.000001) {
  return a >= 0 ? stickAbs(a, b, threshold) : -stickAbs(a, b, threshold)
}

// https://www.youtube.com/watch?v=-Ad6pYjCAmg
const poly = (polyNum, x) => polyNum.reduce(
  (r, n, i) => sum(r, multiply(pow(x, i), n)), 0
)

module.exports = {
  ...mathjs,
  sum,
  pow,
  multiply,
  divide,
  poly,
  random,
  mean,
  stick,
  almostEqual
}
