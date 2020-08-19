const Atom = require('./Atom')

it('[PolySpace] [Atom] [Basics]', () => {
  const atom = new Atom()
  expect(atom.getValue()).toBe(0)

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

it('[PolySpace] [Atom] [addNeighbor]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toBe(3)
  let left = atom.addNeighbor(-0.1)
  expect(atom.left).toBe(left)
})

it('[PolySpace] [Atom] [addConnected]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toBe(3)
  expect(atom.getConnectedValues()).toEqual([3])

  const left = atom.addLeftConnected(3)
  expect(left.getValue()).toBe(0)
  expect(atom.getConnectedValues()).toEqual([0, 3])

  const exLeft = atom.left
  atom.addConnected(-1.5)
  expect(atom.left).not.toBe(exLeft)
  expect(atom.left.left).toBe(exLeft)
  expect(atom.left.getValue()).toBe(1.5)
  expect(atom.getConnectedValues()).toEqual([0, 1.5, 3])


  const right = atom.addRightConnected(3)
  expect(right.getValue()).toBe(6)
  expect(atom.getConnectedValues()).toEqual([0, 1.5, 3, 6])

  const exRight = atom.right
  atom.addConnected(1.5)
  expect(atom.right).not.toBe(exRight)
  expect(atom.right.right).toBe(exRight)
  expect(atom.right.getValue()).toBe(4.5)
  expect(atom.getConnectedValues()).toEqual([0, 1.5, 3, 4.5, 6])

  const leftMost = atom.addConnected(-10)
  expect(leftMost.getValue()).toBe(-7)
  expect(leftMost.left).toBe(null)
  expect(leftMost.getLeftNeighborValue()).toBe(Atom.LEFT_INFINITY)
  expect(atom.getConnectedValues()).toEqual([-7, 0, 1.5, 3, 4.5, 6])

  const rightMost = atom.addConnected(10)
  expect(rightMost.getValue()).toBe(13)
  expect(rightMost.right).toBe(null)
  expect(rightMost.getRightNeighborValue()).toBe(Atom.RIGHT_INFINITY)
  expect(atom.getConnectedValues()).toEqual([-7, 0, 1.5, 3, 4.5, 6, 13])
})
