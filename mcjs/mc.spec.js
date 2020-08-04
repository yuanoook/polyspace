mc = require('./mc')

it('Machine choosing', () => {
  expect(mc(0, 1)).toBe(1)
  expect(mc(0)).toBe(1)

  mc(1, 2)
  mc(2, 3)
  mc(3, 4)
  expect(mc(4)).toBe(5)
})
