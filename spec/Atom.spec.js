const Atom = require('../src/Atom')
const AtomConst = require('../src/Atom/Atom.Const')

it('[PolySpace] [Atom] [Basics]', () => {
  const atom = new Atom()
  expect(atom.getValue()).toBe(0)

  expect(atom.left).toBe(null)
  expect(atom.right).toBe(null)
  expect(Atom.DISTANCE_RATIO_HALF).toBe(.5)

  atom.findLeftNeighbor()
  expect(atom.left).not.toBe(null)
  expect(atom.left.getValue()).toBe(Atom.LEFT_SAFE_INTEGER / 2)
  expect(atom.right).toBe(null)

  atom.findRightNeighbor()
  expect(atom.right).not.toBe(null)
  expect(atom.right.getValue()).toBe(Atom.RIGHT_SAFE_INTEGER / 2)

  expect(atom.left.right).toBe(atom)
  expect(atom.left.left).toBe(null)
  expect(atom.right.left).toBe(atom)
  expect(atom.right.right).toBe(null)

  let exLeft = atom.left
  let newLeft = atom.findLeftNeighbor()
  expect(atom.left).not.toBe(exLeft)
  expect(atom.left).toBe(newLeft)
  expect(atom.left.left).toBe(exLeft)
  expect(atom.left).toBe(exLeft.right)
  expect(exLeft.right).toBe(atom.left)
  expect(newLeft.getValue()).toBe(
    exLeft.getValue() * Atom.DISTANCE_RATIO_HALF +
    atom.getValue() * Atom.DISTANCE_RATIO_HALF
  )

  let exRight = atom.right
  let newRight = atom.findRightNeighbor()
  expect(atom.right).not.toBe(exRight)
  expect(atom.right).toBe(newRight)
  expect(atom.right.right).toBe(exRight)
  expect(atom.right).toBe(exRight.left)
  expect(exRight.left).toBe(atom.right)
  expect(newRight.getValue()).toBe(
    exRight.getValue() * Atom.DISTANCE_RATIO_HALF +
    atom.getValue() * Atom.DISTANCE_RATIO_HALF
  )

  let configuredAtom = new Atom(0, {parent: ':D'})
  expect(configuredAtom.parent).toBe(':D')
})

it('[PolySpace] [Atom] [baseUnit & limits]', () => {
  let atom = new Atom()
  expect(atom.baseUnit).toBe(AtomConst.BASE_UNIT)
  expect(atom.leftLimit).toBe(AtomConst.LEFT_SAFE_INTEGER)
  expect(atom.rightLimit).toBe(AtomConst.RIGHT_SAFE_INTEGER)

  let atomWithUnit1 = new Atom(0, {baseUnit: 1})
  expect(atomWithUnit1.baseUnit).toBe(1)

  atom = new Atom(0, {leftLimit: -10, rightLimit: 10})
  expect(atom.leftLimit).toBe(-10)
  expect(atom.rightLimit).toBe(10)

  expect(atomWithUnit1.leftLimit).toBe(AtomConst.LEFT_SAFE_INTEGER)
  expect(atomWithUnit1.rightLimit).toBe(AtomConst.RIGHT_SAFE_INTEGER)
})

it('[PolySpace] [Atom] [getChainAtoms]', () => {
  const atom = new Atom(3)
  atom.findConnectedsAtScalars([1, 2, 4, 5])
  expect(atom.getLeftChainValues()).toEqual([1, 2])
  expect(atom.getLeftChainValues(true)).toEqual([1, 2, 3])
  expect(atom.getRightChainValues()).toEqual([4, 5])
  expect(atom.getRightChainValues(true)).toEqual([3, 4, 5])
  expect(atom.getChainValues()).toEqual([1, 2, 3, 4, 5])
})

it('[PolySpace] [Atom] [findNeighbor]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toBe(3)

  let left = atom.findNeighbor(-0.1)
  expect(atom.left).toBe(left)

  let right = atom.findNeighbor(0.2)
  expect(atom.right).toBe(right)

  expect(atom.getChainValues()).toEqual([
    atom.getValue() * 0.9 + Atom.LEFT_SAFE_INTEGER * 0.1,
    3,
    atom.getValue() * 0.8 + Atom.RIGHT_SAFE_INTEGER * 0.2,
  ])
})

describe('[PolySpace] [Atom] [findBiNeighbor]', () => {
  it('Find right middle point neighbors', () => {
    const atom = new Atom(3)
    atom.findConnectedsAtScalars([1, 5])
    const biNeighbors = atom.findBiNeighbors()
    const biNeighborValues = biNeighbors.map(atom => atom.getValue())
    expect(biNeighborValues).toEqual([2, 4])
  })

  it('Run certain times with start point of Number 0', () => {
    const atom = new Atom(0)
    let biNeighbors = atom.findBiNeighbors()
    let count = 1
    while (biNeighbors.length) {
      biNeighbors = atom.findBiNeighbors()
      count ++
    }
    expect(count / Atom.SCALE_DEPTH_LOG2).toBeCloseTo(1)
    expect(atom.isCloseTo(atom.left)).toBe(true)
    expect(atom.isCloseTo(atom.right)).toBe(true)
  })

  it('Run certain times with start point of Number 1', () => {
    const atom = new Atom(1)
    let biNeighbors = atom.findBiNeighbors()
    let count = 1
    while (biNeighbors.length) {
      biNeighbors = atom.findBiNeighbors()
      count ++
    }
    expect(count / Atom.SCALE_DEPTH_LOG2_REAL).toBeCloseTo(1, 1)
    expect(atom.isCloseTo(atom.left)).toBe(true)
    expect(atom.isCloseTo(atom.right)).toBe(true)
  })
})

it('[PolySpace] [Atom] [findConnected]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toBe(3)
  expect(atom.getChainValues()).toEqual([3])

  const left = atom.findLeftConnected(3)
  expect(left.getValue()).toBe(0)
  expect(atom.getChainValues()).toEqual([0, 3])

  const exLeft = atom.left
  atom.findConnected(-1.5)
  expect(atom.left).not.toBe(exLeft)
  expect(atom.left.left).toBe(exLeft)
  expect(atom.left.getValue()).toBe(1.5)
  expect(atom.getChainValues()).toEqual([0, 1.5, 3])


  const right = atom.findRightConnected(3)
  expect(right.getValue()).toBe(6)
  expect(atom.getChainValues()).toEqual([0, 1.5, 3, 6])

  const exRight = atom.right
  atom.findConnected(1.5)
  expect(atom.right).not.toBe(exRight)
  expect(atom.right.right).toBe(exRight)
  expect(atom.right.getValue()).toBe(4.5)
  expect(atom.getChainValues()).toEqual([0, 1.5, 3, 4.5, 6])

  const leftMost = atom.findConnected(-10)
  expect(leftMost.getValue()).toBe(-7)
  expect(leftMost.left).toBe(null)
  expect(leftMost.getLeftNeighborValue()).toBe(Atom.LEFT_INFINITY)
  expect(atom.getChainValues()).toEqual([-7, 0, 1.5, 3, 4.5, 6])

  const rightMost = atom.findConnected(10)
  expect(rightMost.getValue()).toBe(13)
  expect(rightMost.right).toBe(null)
  expect(rightMost.getRightNeighborValue()).toBe(Atom.RIGHT_INFINITY)
  expect(atom.getChainValues()).toEqual([-7, 0, 1.5, 3, 4.5, 6, 13])
})

it('[PolySpace] [Atom] [random] [findRandomNeighbor]', () => {
  const atom = new Atom()
  let neighbor = atom.findRandomNeighbor()
  expect(atom.left === neighbor || atom.right === neighbor).toBe(true)
})

it('[PolySpace] [Atom] [random] [gotoRandomNeighbor]', () => {
  const atom = new Atom()
  let left = atom.findLeftNeighbor()
  let right = atom.findRightNeighbor()
  neighbor = atom.gotoRandomNeighbor()
  expect(left === neighbor || right === neighbor).toBe(true)
})

it('[PolySpace] [Atom] [random] [gotoRandomConnected]', () => {
  const atom = new Atom()
  atom.findRandomConnected()
  atom.findRandomConnected()
  atom.findRandomConnected()
  neighbor = atom.gotoRandomConnected()
  expect(atom.getChainAtoms().indexOf(neighbor) > -1).toBe(true)
})

it('[PolySpace] [Atom] [random] [findRandomConnected]', () => {
  const atom = new Atom()
  expect(
    atom.validateValue(atom.findRandomConnected().getValue())
  ).toBe(true)
})

it('[PolySpace] [Atom] [validateValue]', () => {
  const atom = new Atom()
  expect(() => atom.validateValue(Infinity)).toThrow()
  expect(() => atom.validateValue(Number.MAX_SAFE_INTEGER + 1)).toThrow()
  expect(() => atom.validateValue(Number.MIN_SAFE_INTEGER - 1)).toThrow()
  expect(() => atom.validateValue(-Infinity)).toThrow()

  expect(() => new Atom(Infinity)).toThrow()
  expect(() => new Atom(Number.MAX_SAFE_INTEGER + 1)).toThrow()
  expect(() => new Atom(Number.MIN_SAFE_INTEGER - 1)).toThrow()
  expect(() => new Atom(-Infinity)).toThrow()
})

it('[PolySpace] [Atom] [findConnectedAtScalar]', () => {
  const atom = new Atom()
  let newValue = (Math.random() - 0.5) * 10000000

  if (newValue === 0) {
    expect(() => atom.findConnectedAtScalar(newValue)).toThrow()
  } else {
    expect(atom.findConnectedAtScalar(newValue).getValue()).toBe(newValue)
  }

  expect(() => atom.findConnectedAtScalar(0)).toThrow()
})

it('[PolySpace] [Atom] [randomNeighbor]', () => {
  const atom = new Atom()
  const newNeighbors = atom.findRandomNeighbors(5)
  expect(newNeighbors.length).toBe(5)

  const newNeighbor = newNeighbors[newNeighbors.length - 1]
  expect(atom.isNeighbor(newNeighbor)).toBe(true)
  expect(newNeighbor.isNeighbor(atom)).toBe(true)

  const neighbor = atom.gotoRandomNeighbor()
  expect(atom.isNeighbor(neighbor)).toBe(true)
  expect(neighbor.isNeighbor(atom)).toBe(true)
})

it('[PolySpace] [Atom] [randomConnected]', () => {
  const atom = new Atom()
  expect(() => atom.gotoRandomConnected()).toThrow()

  const newConnecteds = atom.findRandomConnecteds(5)
  expect(newConnecteds.length).toBe(5)

  const newConnected = newConnecteds[newConnecteds.length - 1]
  expect(atom.isConnected(newConnected)).toBe(true)
  expect(newConnected.isConnected(atom)).toBe(true)

  const connected = atom.gotoRandomConnected()
  expect(atom.isConnected(connected)).toBe(true)
  expect(connected.isConnected(atom)).toBe(true)
})

it('[PolySpace] [Atom] [isConnected]', () => {
  const atom = new Atom()
  const newNeighbors = atom.findRandomNeighbors(5)
  const newConnecteds = atom.findRandomConnecteds(5)
  const neighbor = newNeighbors[0]
  const connected = newConnecteds[0]

  expect(neighbor.isConnected(connected)).toBe(true)
  expect(connected.isConnected(neighbor)).toBe(true)
})

it('[PolySpace] [Atom] [gotoLeftMost / gotoRightMost]', () => {
  const atom = new Atom()
  const newNeighbors = atom.findRandomNeighbors(5)
  const newConnecteds = atom.findRandomConnecteds(5)
  const leftMost = atom.gotoLeftMost()
  const rightMost = atom.gotoRightMost()

  expect(leftMost.isConnected(rightMost)).toBe(true)
  expect(rightMost.isConnected(leftMost)).toBe(true)
  expect(leftMost.gotoLeftMost()).toBe(leftMost)
  expect(rightMost.gotoRightMost()).toBe(rightMost)
  expect(leftMost.gotoRightMost()).toBe(rightMost)
  expect(rightMost.gotoLeftMost()).toBe(leftMost)
})

it('[PolySpace] [Atom] [walkLeftUntil / walkRightUntil]', () => {
  const atom = new Atom()
  const newNeighbors = atom.findRandomNeighbors(5)
  const newConnecteds = atom.findRandomConnecteds(5)
  const chainLength = atom.getChainAtoms().length
  const leftMost = atom.gotoLeftMost()
  const rightMost = atom.gotoRightMost()

  const callFalse = jest.fn(x => false)
  expect(atom.walkLeftUntil(callFalse)).not.toBe(true)
  expect(atom.walkRightUntil(callFalse)).not.toBe(true)
  expect(callFalse.mock.calls.length).toBe(chainLength - 1)
  expect(callFalse.mock.calls.find(([x]) => x === atom)).not.toBe(atom)

  const callTrue = jest.fn(x => true)
  expect(atom.walkLeftUntil(callTrue)).toBe(true)
  expect(atom.walkRightUntil(callTrue)).toBe(true)
  expect(callTrue.mock.calls.length).toBe(2)
  expect(callTrue.mock.calls.find(([x]) => x === atom)).not.toBe(atom)

  const callX = jest.fn(x => x)
  expect(atom.walkLeftUntil(callX)).toBe(atom.left)
  expect(atom.walkRightUntil(callX)).toBe(atom.right)
  expect(callX.mock.calls.length).toBe(2)
  expect(callX.mock.calls).toEqual([[atom.left], [atom.right]])

  const callY = jest.fn(y => y)
  expect(atom.walkLeftUntil(callY, true)).toBe(atom)
  expect(atom.walkRightUntil(callY, true)).toBe(atom)
  expect(callY.mock.calls.length).toBe(2)
  expect(callY.mock.calls).toEqual([[atom], [atom]])
})

it('[PolySpace] [Atom] [walkToLeftMost / walkToRightMost]', () => {
  const atom = new Atom()
  const newNeighbors = atom.findRandomNeighbors(5)
  const newConnecteds = atom.findRandomConnecteds(5)
  const chainAtoms = atom.getChainAtoms()
  expect(chainAtoms.length).toBe(11)

  const leftMost = atom.gotoLeftMost()
  const rightMost = atom.gotoRightMost()

  const callX = jest.fn(x => x)
  atom.walkToLeftMost(callX, true)
  atom.walkToRightMost(callX)
  const sortedCalledAtoms = callX.mock.calls
    .map(([a]) => a)
    .sort(({value: a}, {value: b}) => a - b)

  expect(sortedCalledAtoms).toEqual(chainAtoms)

  const callY = jest.fn(y => y)
  expect(atom.walkAllFromLeft(callY)).toEqual(chainAtoms)
  expect(atom.walkAllFromRight(callY)).toEqual(chainAtoms.reverse())
})
