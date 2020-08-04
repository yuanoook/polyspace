const PRECISION = 10

const fix = v => + (v).toFixed(PRECISION)
const add = (a, b) => fix(a + b)
const pow = (base, exponents) => fix(Math.pow(base, exponents))
const multiply = (base, times) => fix(base * times)

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
  poly
}
