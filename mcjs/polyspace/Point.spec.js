const Point = require('./Point')
const Atom = require('./Atom')

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

it('[PolySpace] [Point] [isSame]', () => {
  expect(new Point([1, 2, 3, 4]).isSame(new Point([1, 2, 3, 4]))).toBe(true)
  expect(new Point([1, 2]).isSame(new Point([1, 2, 3, 4]))).toBe(false)
  expect(new Point([1, 2]).isSame(new Point([1, 2, 0, 0]))).toBe(true)
})

it('[PolySpace] [Point] [copyWithAtomAt]', () => {
  const point = new Point([1, 2, 3, 4])
  const newPoint = point.copyWithAtomAt(0, new Atom())
  expect(newPoint.getNomials()).toEqual([0, 2, 3, 4])
})

it('[PolySpace] [Point] [findNeighborAt]', () => {
  const point = new Point([1, 2, 3, 4])
  let neighbor = point.findNeighborAt(0)
  expect(point.isSame(neighbor)).toBe(false)
  expect(point.isNeighbor(neighbor)).toBe(true)
  expect(point.isLeftNeighbor(neighbor) ||
    point.isRightNeighbor(neighbor)
  ).toBe(true)

  let leftNeighbor = point.findLeftNeighborAt(1)
  expect(point.isSame(leftNeighbor)).toBe(false)
  expect(point.isNeighbor(leftNeighbor)).toBe(true)
  expect(point.isLeftNeighbor(leftNeighbor)).toBe(true)
  expect(point.isRightNeighbor(leftNeighbor)).toBe(false)
  expect(neighbor.isNeighbor(leftNeighbor)).toBe(false)

  let rightNeighbor = point.findRightNeighborAt(2)
  expect(point.isSame(rightNeighbor)).toBe(false)
  expect(point.isNeighbor(rightNeighbor)).toBe(true)
  expect(point.isRightNeighbor(rightNeighbor)).toBe(true)
  expect(point.isLeftNeighbor(rightNeighbor)).toBe(false)
  expect(neighbor.isNeighbor(rightNeighbor)).toBe(false)

  let exLeft = leftNeighbor
  let newLeft = point.findLeftNeighborAt(1)
  expect(exLeft.isSame(newLeft)).toBe(false)
  expect(exLeft.isNeighbor(newLeft)).toBe(true)
  expect(exLeft.isRightNeighbor(newLeft)).toBe(true)
})

it('[PolySpace] [Point] [findRandomNeighborAt]', () => {
  const point = new Point([1, 2, 3, 4])
  let neighbor = point.findRandomNeighborAt(0)

  expect(point.isSame(neighbor)).toBe(false)
  expect(point.isNeighbor(neighbor)).toBe(true)
  expect(neighbor.isNeighbor(point)).toBe(true)
  expect(point.isLeftNeighbor(neighbor) ||
    point.isRightNeighbor(neighbor)
  ).toBe(true)

  expect(point.isConnected(neighbor)).toBe(true)
  expect(neighbor.isConnected(point)).toBe(true)

  let neighbors = point.findRandomNeighborsAt(1, 5)
  expect(neighbor.isConnected(neighbors[1])).toBe(false)
  expect(neighbor.isNeighbor(neighbors[2])).toBe(false)

  expect(neighbors.length).toBe(5)
  expect(point.isNeighbor(neighbors[4])).toBe(true)
  expect(point.isConnected(neighbors[2])).toBe(true)
  expect(neighbors[0].isConnected(neighbors[4])).toBe(true)
  expect(neighbors[2].isConnected(neighbors[3])).toBe(true)
})
