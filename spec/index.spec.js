const { Point, Origin } = require('../src/index')

it('[PolySpace] [Origin]', () => {
  const origin = new Origin()
  expect(origin.getNomials()).toEqual([])

//   expect(origin.getAtom(0)).toBe(0)
//   expect(origin.getAtom(1)).toBe(0)
//   expect(origin.getAtom(2)).toBe(0)
})
