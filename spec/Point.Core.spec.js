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
