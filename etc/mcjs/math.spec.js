math = require('./math')

it('Math', () => {
  expect(math.stick(0.0000000001)).toBe(0)
  expect(math.stick(1.0000000001)).toBe(1)
  expect(math.stick(0.9999999999)).toBe(1)
  expect(math.stick(1.9999999999)).toBe(2)
  expect(math.stick(-0.9999999999)).toBe(-1)
  expect(math.stick(-1.9999999999)).toBe(-2)
})
