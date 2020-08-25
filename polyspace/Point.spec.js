const Point = require('./Point')
const Atom = require('./Atom')

it('[PolySpace] [Point] [Basics]', () => {
  const point = new Point([1, 2, 3, 4])
  expect(point.getAtom(0).getValue()).toBe(1)
  expect(point.getAtom(1).getValue()).toBe(2)
  expect(point.getAtom(2).getValue()).toBe(3)
  expect(point.getAtom(3).getValue()).toBe(4)
  expect(point.getAtoms().map(atom => atom.parent))
    .toEqual([point, point, point, point])

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

it('[PolySpace] [Point] [findBiNeighbors]', () => {
  const point = new Point([1, 2, 3, 4, 5, 6, 7, 8])
  const dimensions = 8
  point.extendDimension(dimensions)
  let biNeighbors = point.findBiNeighbors()
  expect(biNeighbors.length).toBe(dimensions * 2)
  let count = 1
  while (biNeighbors.length) {
    biNeighbors = point.findBiNeighbors()
    count ++
  }
  expect(count / Atom.SCALE_DEEPTH_LOG2_REAL).toBeCloseTo(1, 1)
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

  let neighborsAt0 = point.findRandomNeighborsAt(0, 5)
  expect(point.isLeftConnected(neighbor) ||
    point.isRightConnected(neighbor)
  ).toBe(true)
  expect(point.isLeftConnected(neighborsAt0[0]) ||
    point.isRightConnected(neighborsAt0[0])
  ).toBe(true)
  expect(neighbor.isLeftConnected(neighborsAt0[1]) ||
    neighbor.isRightConnected(neighborsAt0[1])
  ).toBe(true)
})

it('[PolySpace] [Point] [findRandomLeftNeighbor]', () => {
  const point = new Point([1, 2, 3, 4])
  let neighbor = point.findRandomLeftNeighborWith(0.5)
  expect(neighbor.isRightNeighbor(point)).toBe(true)

  let newNeighbor = point.findRandomLeftNeighbor()
  expect(newNeighbor.isRightNeighbor(point)).toBe(true)

  let rwNeighbors = point.findRandomLeftNeighborsWith(0.5, 5)
  expect(rwNeighbors.length).toBe(5)
  expect(point.isLeftNeighbor(rwNeighbors[4]))

  let rNeighbors = point.findRandomLeftNeighbors(5)
  expect(rNeighbors.length).toBe(5)
  expect(point.isLeftNeighbor(rNeighbors[4]))

  expect(() => point.findRandomLeftNeighborWith(-0.5)).toThrow()
})

it('[PolySpace] [Point] [findRandomRightNeighbor]', () => {
  const point = new Point([1, 2, 3, 4])
  let neighbor = point.findRandomRightNeighborWith(0.5)
  expect(neighbor.isLeftNeighbor(point)).toBe(true)

  let newNeighbor = point.findRandomRightNeighbor()
  expect(newNeighbor.isLeftNeighbor(point)).toBe(true)

  let rwNeighbors = point.findRandomRightNeighborsWith(0.5, 5)
  expect(rwNeighbors.length).toBe(5)
  expect(point.isRightNeighbor(rwNeighbors[4]))

  let rNeighbors = point.findRandomRightNeighbors(5)
  expect(rNeighbors.length).toBe(5)
  expect(point.isRightNeighbor(rNeighbors[4]))

  expect(() => point.findRandomRightNeighborWith(-0.5)).toThrow()
})

it('[PolySpace] [Point] [findRandomNeighbor]', () => {
  const point = new Point([1, 2, 3, 4])
  let neighbor = point.findRandomNeighborWith(0.5)
  expect(neighbor.isNeighbor(point)).toBe(true)

  let newNeighbor = point.findRandomNeighbor()
  expect(newNeighbor.isNeighbor(point)).toBe(true)

  let rwNeighbors = point.findRandomNeighborsWith(0.5, 5)
  expect(rwNeighbors.length).toBe(5)
  expect(point.isNeighbor(rwNeighbors[4]))

  let rNeighbors = point.findRandomNeighbors(5)
  expect(rNeighbors.length).toBe(5)
  expect(point.isNeighbor(rNeighbors[4]))

  expect(() => point.findRandomNeighborWith(-0.5)).not.toThrow()
})

it('[PolySpace] [Point] [findConnectedAt]', () => {
  const point = new Point([1, 2, 3, 4])
  let connected = point.findConnectedAt(0, -1)
  expect(connected.isRightNeighbor(point)).toBe(true)
  expect(point.isLeftNeighbor(connected)).toBe(true)
  expect(point.euclideanDistance(connected)).toBe(1)

  let lConnected = point.findLeftConnectedAt(0, 10)
  expect(connected.isLeftNeighbor(lConnected)).toBe(true)
  expect(lConnected.isRightNeighbor(connected)).toBe(true)
  expect(lConnected.euclideanDistance(connected)).toBe(9)

  expect(point.isLeftConnected(lConnected)).toBe(true)
  expect(lConnected.isConnected(point)).toBe(true)

  let rConnected = point.findRightConnectedAt(0, 4)
  expect(connected.isRightConnected(rConnected)).toBe(true)
  expect(rConnected.isLeftConnected(connected)).toBe(true)
  expect(rConnected.euclideanDistance(connected)).toBe(5)

  expect(point.isRightConnected(rConnected)).toBe(true)
  expect(rConnected.isConnected(point)).toBe(true)

  let sConnected = point.findConnectedAtWithScalar(0, 5)
  expect(sConnected.euclideanDistance(lConnected)).toBe(14)
  expect(sConnected.isLeftConnected(lConnected)).toBe(true)

  expect(rConnected.euclideanDistance(sConnected)).toBe(0)
  expect(rConnected.isSame(sConnected)).toBe(true)
})

it('[PolySpace] [Point] [findRandomConnected]', () => {
  const point = new Point([1, 2, 3, 4])
  let connected = point.findRandomConnected()
  expect(connected.isNeighbor(point)).toBe(true)
  expect(point.isNeighbor(connected)).toBe(true)

  let connecteds = point.findRandomConnecteds(5)
  expect(connecteds.length).toBe(5)
  validatePythagorasTheorem(connecteds[1], connecteds[2], point)

  let lConnected = point.findRandomLeftConnected()
  expect(point.isLeftConnected(lConnected)).toBe(true)
  expect(lConnected.isConnected(point)).toBe(true)

  let lConnecteds = point.findRandomLeftConnecteds(5)
  expect(lConnecteds.length).toBe(5)
  validatePythagorasTheorem(lConnecteds[1], lConnecteds[2], point)

  let rConnected = point.findRandomRightConnected()
  expect(point.isRightConnected(rConnected)).toBe(true)
  expect(rConnected.isConnected(point)).toBe(true)

  let rConnecteds = point.findRandomRightConnecteds(5)
  expect(rConnecteds.length).toBe(5)
  validatePythagorasTheorem(rConnecteds[1], rConnecteds[2], point)

  let sConnected = point.findRandomConnectedWithScalar(5)
  expect([4, 3, 2, 1].indexOf(point.euclideanDistance(sConnected)) > -1).toBe(true)
  expect(sConnected.isConnected(point)).toBe(true)
})

it('[PolySpace] [Point] [euclideanDistance]', () => {
  expect(new Point([])
    .euclideanDistance(new Point([]))).toBe(0)
  expect(new Point([0, 0])
    .euclideanDistance(new Point([]))).toBe(0)
  expect(new Point([1, 1, 1])
    .euclideanDistance(new Point([]))).toBe(Math.sqrt(3))
  expect(new Point([2, 2, 2])
    .euclideanDistance(new Point([1, 1, 1]))).toBe(Math.sqrt(3))

  const point = new Point([1, 1, 1, 1])
  const connected1 = point.findRandomConnectedWithScalar(4)
  const connected2 = point.findRandomConnectedWithScalar(5)
  validatePythagorasTheorem(connected1, connected2, point)

  const neighbors = point.findRandomNeighbors(5)
  validatePythagorasTheorem(neighbors[1], neighbors[2], point)
})

function validatePythagorasTheorem (A, B, C) {
  const a = B.euclideanDistance(C)
  const b = A.euclideanDistance(C)
  const c = A.euclideanDistance(B)
  const a2b2_over_c2 = (a ** 2 + b ** 2) / (c ** 2)
  const expectation = A.isConnected(B) ? a2b2_over_c2 : 1
  expect(a2b2_over_c2).toBeCloseTo(expectation, 6)
}

it('[PolySpace] [Point] [makeAtom]', () => {
  const point = new Point()
  expect(point.makeAtom(3).parent).toBe(point)
})

it('[PolySpace] [Point] [map / reduce]', () => {
  const point = new Point([1, 2, 3, 4])
  expect(point.map(a => a.getValue())).toEqual([1 ,2 ,3, 4])
  expect(point.reduce((p, a) => p + a.getValue(), 0)).toEqual(10)
})

it('[PolySpace] [Point] [getChainPoints]', () => {
  const point = new Point([1, 2, 3, 4])
  expect(point.getChainPoints().length).toBe(1)
  point.findConnectedAtWithScalar(0, 2)
  point.findConnectedAtWithScalar(0, 3)
  expect(point.getLeftChainPointsAt(0)).toEqual([])
  expect(point.getLeftChainPointsAt(0, true)).toEqual([point])
  expect(
    point.getRightChainPointsAt(0).map(point => point.getNomials())
  ).toEqual([
      [2, 2, 3, 4],
      [3, 2, 3, 4]
  ])
  expect(
    point.getRightChainPointsAt(0, true).map(point => point.getNomials())
  ).toEqual([
    [1, 2, 3, 4],
    [2, 2, 3, 4],
    [3, 2, 3, 4]
  ])
  point.findConnectedAtWithScalar(0, 0)
  point.findConnectedAtWithScalar(0, -1)
  expect(point.getChainPointsAt(0)[2]).toEqual(point)
  expect(
    point.getChainPointsAt(0).map(point => point.getNomials())
  ).toEqual([
    [-1, 2, 3, 4],
    [0, 2, 3, 4],
    [1, 2, 3, 4],
    [2, 2, 3, 4],
    [3, 2, 3, 4]
  ])

  expect(point.getChainPoints().length).toBe(5)
  point.findRandomNeighbors(5)
  expect(point.getChainPoints().length).toBe(10)
  expect(point.getChainPoints(false).length).toBe(9)
  expect(point.getChainPoints()[0]).toBe(point)
  expect(point.getChainPoints(false)[0]).not.toBe(point)
})

it('[PolySpace] [Point] [getInNetworkPoints / isInNetwork]', () => {
  const point = new Point([1, 2, 3, 4])
  const rNeighbors9 = point.findRandomNeighbors(9)
  expect(point.getInNetworkPoints().length).toBe(10)
  expect(point.getInNetworkPoints(false).length).toBe(9)
  expect(point.getInNetworkPoints()[0]).toBe(point)
  expect(point.getInNetworkPoints(false)[0]).not.toBe(point)

  const rNeighbors5 = point.findRandomNeighbors(5)
  expect(point.getInNetworkPoints().length).toBe(15)
  expect(point.getInNetworkPoints(false).length).toBe(14)
  expect(point.getInNetworkPoints()[0]).toBe(point)
  expect(point.getInNetworkPoints(false)[0]).not.toBe(point)

  pointsInNetwork = point.getInNetworkPoints()
  expect(pointsInNetwork[3].isInNetwork(pointsInNetwork[10])).toBe(true)

  const sum59 = sumPointsNomials(rNeighbors9) + sumPointsNomials(rNeighbors5)
  const sumExcludeSelf = sumPointsNomials(point.getInNetworkPoints(false))
  expect(sum59 / sumExcludeSelf).toBeCloseTo(1, 6)
})

function sumPointsNomials (points) {
  return points.reduce((sum, p) =>
    sum + p.atoms.reduce((s, a) => s + a.getValue(), 0)
  , 0)
}
