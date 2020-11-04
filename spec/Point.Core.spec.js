const Point = require('../packages/Point')

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

it('[PolySpace] [Point] [cloneWithNewAtomAt with direction]', () => {
  const point10 = new Point([10, 10, {value: 10, leftLimit: 1, rightLimit: 1000}])
  const index = 1
  const newAtom = point10.getAtom(1).findLeftConnected(1)

  const clonePoint0 = point10.cloneWithNewAtomAt(index, newAtom)
  expect(clonePoint0.getNomials()).toEqual([10, 9, 10])

  const clonePoint1 = point10.cloneWithNewAtomAt(index, newAtom, [1, 1, 1])
  expect(clonePoint1.getNomials()).toEqual([9, 9, 9])

  const clonePoint210 = point10.cloneWithNewAtomAt(index, newAtom, [2, 1])
  expect(clonePoint210.getNomials()).toEqual([8, 9, 10])

  const clonePointN210 = point10.cloneWithNewAtomAt(index, newAtom, [-2, 1, 10000])
  expect(clonePointN210.getNomials()).toEqual([12, 9, 1])

  const clonePointN2N10 = point10.cloneWithNewAtomAt(index, newAtom, [-2, -1, 10000])
  expect(clonePointN2N10.getNomials()).toEqual([8, 9, 1000])
})

it('[PolySpace] [Point] [findBiNeighborsAt with direction]', () => {
  const point10 = new Point([
    {value: 10, leftLimit: -100, rightLimit: 1000},
    10,
    {value: 10, leftLimit: 0, rightLimit: 1000}
  ])
  const index = 1
  point10.getAtom(1).findLeftConnected(10)
  point10.getAtom(1).findRightConnected(10)

  let biNeighbors = point10.findBiNeighborsAt(index)
  expect(
    biNeighbors.map(p => p.getNomials())
  ).toEqual([
    [10, 5, 10],
    [10, 15, 10]
  ])

  biNeighbors = point10.findBiNeighborsAt(index, [1, 1, 1])
  expect(
    biNeighbors.map(p => p.getNomials())
  ).toEqual([
    [7.5, 7.5, 7.5],
    [12.5, 12.5, 12.5]
  ])

  biNeighbors = point10.findBiNeighborsAt(index, [10000, -1, -10000])
  expect(
    biNeighbors.map(p => p.getNomials())
  ).toEqual([
    [1000, 8.75, 0],
    [-100, 11.25, 1000]
  ])
})
