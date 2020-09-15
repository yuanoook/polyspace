const Atom = require('../src/Atom/index')
const AtomConst = require('../src/Atom/Atom.Const')

it('[PolySpace] [Atom] [findNeighbor]', () => {
  const atom = new Atom(3)
  expect(atom.getValue()).toBe(3)
  atom.findBiNeighbors()

  let left = atom.findNeighbor(-0.1)
  expect(atom.left).toBe(left)

  let right = atom.findNeighbor(0.2)
  expect(atom.right).toBe(right)

  expect(atom.getChainValues()).toEqual([
    Atom.LEFT_SAFE_INTEGER,
    atom.getValue() * 0.9 + Atom.LEFT_SAFE_INTEGER * 0.1,
    3,
    atom.getValue() * 0.8 + Atom.RIGHT_SAFE_INTEGER * 0.2,
    Atom.RIGHT_SAFE_INTEGER
  ])
})
