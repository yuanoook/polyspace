const { Point, Origin } = require('./index')

it('[PolySpace] [Origin]', () => {
  const origin = new Origin()
  expect(origin.getValue()).toEqual([])

  expect(origin.getIndex(0)).toBe(0)
  expect(origin.getIndex(1)).toBe(0)
  expect(origin.getIndex(2)).toBe(0)
})

it('[PolySpace] [Point]', () => {
  const point = new Point([1, 2, 3, 4])
  expect(point.getValue()).toEqual([1, 2, 3, 4])

  expect(point.getIndex(0)).toBe(1)
  expect(point.getIndex(1)).toBe(2)
  expect(point.getIndex(2)).toBe(3)
  expect(point.getIndex(3)).toBe(4)
  expect(point.getIndex(4)).toBe(0)
})
