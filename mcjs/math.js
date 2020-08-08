const PRECISION = 10
const threshold = 0.00001

const fix = (v, precision = PRECISION) => + (v).toFixed(precision)
const add = (a, b) => fix(a + b)
const pow = (base, exponents) => fix(Math.pow(base, exponents))
const multiply = (base, times) => fix(base * times)
const divide = (base, divisor) => fix(base / divisor)
const almostEqual = (a, b) => Math.abs(a - b) <= threshold
const random = (a = 100000000) => fix(a * (Math.random() - 0.5))

// https://www.youtube.com/watch?v=-Ad6pYjCAmg
const poly = (polyNum, x) => polyNum.reduce(
  (r, n, i) => add(r, multiply(pow(x, i), n)),
  0
)

module.exports = {
  PRECISION,
  fix,
  add,
  pow,
  multiply,
  divide,
  poly,
  almostEqual,
  random
}
