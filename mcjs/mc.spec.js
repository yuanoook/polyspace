math = require('./math')
mc = require('./mc')

it('Machine choosing', () => {
  const equal = (a, b) => expect(math.almostEqual(a, b)).toBe(true)

  equal(mc(0, 1), 1)
  equal(mc(0),    1)
  mc(1, 2)
  mc(2, 3)
  mc(3, 4)
  equal(mc(4),    5)
})
