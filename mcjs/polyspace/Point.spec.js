const Point = require('./Point')

it('[PolySpace] [Point] [Basics]', () => {
  const point = new Point([1, 2, 3, 4])

  expect(point.getAtom(0).getValue()).toBe(1)
  expect(point.getAtom(1).getValue()).toBe(2)
  expect(point.getAtom(2).getValue()).toBe(3)
  expect(point.getAtom(3).getValue()).toBe(4)
  expect(point.getAtoms().map(atom => atom.getValue())).toEqual([1, 2, 3, 4])
  expect(point.getDimensions()).toBe(4)

  expect(point.getNomial(0)).toBe(1)
  expect(point.getNomial(1)).toBe(2)
  expect(point.getNomial(2)).toBe(3)
  expect(point.getNomial(3)).toBe(4)

  expect(point.getNomial(6)).toBe(0)
  expect(point.getNomials()).toEqual([1, 2, 3, 4, 0, 0, 0])
  expect(point.getDimensions()).toBe(7)

  point.checkIndex(8)
  expect(point.getNomials()).toEqual([1, 2, 3, 4, 0, 0, 0, 0, 0])
  expect(point.getDimensions()).toBe(9)

  point.checkDimension(10)
  expect(point.getNomials()).toEqual([1, 2, 3, 4, 0, 0, 0, 0, 0, 0])
  expect(point.getDimensions()).toBe(10)
})
