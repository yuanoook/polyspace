const Point = require('../src/Point')

it('[PolySpace] [Point] [Basics]', () => {
  const point = new Point([
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'smoothRadius'},
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'predictBaseStep'},
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'predictTimes'}
  ])
  expect(point.getAtom(0).leftLimit).toBe(1)
  expect(point.getAtom(1).leftLimit).toBe(1)
  expect(point.getAtom(2).leftLimit).toBe(1)

  expect(point.getAtom(0).rightLimit).toBe(1000)
  expect(point.getAtom(1).rightLimit).toBe(1000)
  expect(point.getAtom(2).rightLimit).toBe(1000)
})

it('[PolySpace] [Point] [getDirection]', () => {
  const point0 = new Point([0, 0])
  const point10 = new Point([10, 10, 10])

  expect(point0.getDirection(point0)).toEqual([0, 0])
  expect(point10.getDirection(point10)).toEqual([0, 0, 0])
  expect(point0.getDirection(point10)).toEqual([1, 1, 1])
  expect(point10.getDirection(point0)).toEqual([-1, -1, -1])

  const pointX = new Point([2, 4, 8, 16])
  expect(point0.getDirection(pointX)).toEqual([1, 2, 4, 8])
  expect(point10.getDirection(pointX)).toEqual([-1, -0.75, -0.25, 2])
})
