const Atom = require('./Atom')

it('[PolySpace] [Atom] [Basics]', () => {
  const atom = new Atom()
  expect(atom.getValue()).toEqual(0)

  expect(atom.left).toBe(null)
  expect(atom.right).toBe(null)
  expect(Atom.DISTANCE_RATIO_HALF).toBe(.5)

  atom.addLeftNeighbor()
  expect(atom.left).not.toBe(null)
  expect(atom.left.getValue()).toBe(Atom.LEFT_SAFE_INTEGER / 2)
  expect(atom.right).toBe(null)

  atom.addRightNeighbor()
  expect(atom.right).not.toBe(null)
  expect(atom.right.getValue()).toBe(Atom.RIGHT_SAFE_INTEGER / 2)

  expect(atom.left.right).toBe(atom)
  expect(atom.left.left).toBe(null)
  expect(atom.right.left).toBe(atom)
  expect(atom.right.right).toBe(null)

  let exLeft = atom.left
  let newLeft = atom.addLeftNeighbor()
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
  let newRight = atom.addRightNeighbor()
  expect(atom.right).not.toBe(exRight)
  expect(atom.right).toBe(newRight)
  expect(atom.right.right).toBe(exRight)
  expect(atom.right).toBe(exRight.left)
  expect(exRight.left).toBe(atom.right)
  expect(newRight.getValue()).toBe(
    exRight.getValue() * Atom.DISTANCE_RATIO_HALF +
    atom.getValue() * Atom.DISTANCE_RATIO_HALF
  )
})

it('[PolySpace] [Atom] [Advanced]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toEqual(3)
  let left = atom.addNeighbor(-0.1)

  const left = atom.addLeftConnected(3)
  expect(left.getValue()).toBe(0)

  const right = atom.addRightConnected(3)
  expect(right.getValue()).toBe(6)
})

it('[PolySpace] [Atom] [Advanced]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toEqual(3)
  let left = atom.addNeighbor(-0.1)

  const left = atom.addLeftConnected(3)
  expect(left.getValue()).toBe(0)

  const right = atom.addRightConnected(3)
  expect(right.getValue()).toBe(6)
})

it('[PolySpace] [Atom] [Advanced]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toEqual(3)
  let left = atom.addNeighbor(-0.1)

  const left = atom.addLeftConnected(3)
  expect(left.getValue()).toBe(0)

  const right = atom.addRightConnected(3)
  expect(right.getValue()).toBe(6)
})

