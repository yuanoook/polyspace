const Atom = require('./index')
const AtomConst = require('./Atom.Const')

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
  expect(atom.isCloseIn({value: 30})).toBe(false)
})

it('[PolySpace] [Atom] [isTrapped]', () => {
  expect(new Atom(0, {
    leftLimit: -5,
    rightLimit: 5,
    baseUnit: 10
  }).isTrapped()).toBe(true)
  let atom = new Atom(0, {
    leftLimit: -100,
    rightLimit: 100,
    baseUnit: 10
  })
  expect(atom.isTrapped()).toBe(false)
  atom.findConnectedAtScalar(-5)
  expect(atom.isTrapped()).toBe(false)
  atom.findConnectedAtScalar(5)
  expect(atom.isTrapped()).toBe(true)
})
