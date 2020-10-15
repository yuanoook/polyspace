const Atom = require('../src/Atom/index')
const AtomConst = require('../src/Atom/Atom.Const')

it('[PolySpace] [Atom] [Basics]', () => {
  const atom = new Atom()
  expect(atom.getValue()).toBe(0)

  expect(atom.left).toBe(null)
  expect(atom.right).toBe(null)
  expect(Atom.DISTANCE_RATIO_HALF).toBe(.5)

  atom.findLeftNeighbor()
  expect(atom.left).not.toBe(null)
  expect(atom.left.getValue()).toBe(Atom.LEFT_SAFE_INTEGER)
  expect(atom.right).toBe(null)

  atom.findRightNeighbor()
  expect(atom.right).not.toBe(null)
  expect(atom.right.getValue()).toBe(Atom.RIGHT_SAFE_INTEGER)

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

it('[PolySpace] [Atom] [roundUp]', () => {
  let atom = new Atom()
  expect(atom.roundUp(1)).toBe(1)
  expect(atom.roundUp(1.2)).toBe(1.2)
  expect(atom.roundUp(1.8)).toBe(1.8)
  expect(atom.roundUp(-1.8)).toBe(-1.8)

  atom = new Atom(1, {baseUnit: 1.1})
  expect(atom.roundUp(1)).toBe(1)
  expect(atom.roundUp(1.2)).toBe(1.2)
  expect(atom.roundUp(1.8)).toBe(1.8)
  expect(atom.roundUp(-1.8)).toBe(-1.8)

  atom = new Atom(0, {baseUnit: 1})
  expect(atom.roundUp(1)).toBe(1)
  expect(atom.roundUp(1.2)).toBe(1)
  expect(atom.roundUp(1.8)).toBe(2)
  expect(atom.roundUp(-1.8)).toBe(-2)

  atom = new Atom(3, {baseUnit: 5})
  expect(atom.roundUp(1)).toBe(3)
  expect(atom.roundUp(7)).toBe(8)
  expect(atom.roundUp(10)).toBe(8)
  expect(atom.roundUp(-1)).toBe(-2)
  expect(atom.roundUp(-5)).toBe(-7)
})

it('[PolySpace] [Atom] [forceOffsetValue]', () => {
  const atom = new Atom()
  atom.forceOffsetValue(1)
  expect(atom.getValue()).toBe(1)

  atom.forceOffsetValue(-10)
  expect(atom.getValue()).toBe(-9)

  atom.findBiNeighbors()
  expect(() => atom.forceOffsetValue(1)).toThrow()
})

it('[PolySpace] [Atom] [baseUnit, leftLimit, rightLimit]', () => {
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

it('[PolySpace] [Atom] [isCloseIn]', () => {
  let atom = new Atom(0, {baseUnit: 10})
  expect(atom.isCloseIn({value: 3})).toBe(true)

  expect(atom.isCloseIn({value: 5})).toBe(false)
  expect(atom.isCloseIn({value: -5})).toBe(false)

  expect(atom.isCloseIn({value: 30})).toBe(false)
})

it('[PolySpace] [Atom] [isTrapped]', () => {
  expect(new Atom(0, {
    leftLimit: -4.75,
    rightLimit: 4.75,
    baseUnit: 9.5
  }).isTrapped()).toBe(false)

  expect(new Atom(0, {
    leftLimit: -5,
    rightLimit: 5,
    baseUnit: 10
  }).isTrapped()).toBe(true)

  expect(new Atom(0, {
    leftLimit: -5,
    rightLimit: 5,
    baseUnit: 11
  }).isTrapped()).toBe(true)

  let atom = new Atom(0, {
    leftLimit: -100,
    rightLimit: 100,
    baseUnit: 10
  })
  expect(atom.isTrapped()).toBe(false)
  atom.findConnectedAtScalar(-10)
  expect(atom.isTrapped()).toBe(false)
  atom.findConnectedAtScalar(10)
  expect(atom.isTrapped()).toBe(true)

  atom.findBiNeighbors()
  expect(atom.isTrapped()).toBe(true)
})
