const {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber,
  repeat,
  diffNomials,
  isSameNomials,
  euclideanDistance
} = require('./utils')

it('[PolySpace] [utils] [generateRandomDistanceRatio]', () => {
  let count = 100
  while (--count > 0) {
    const ratio = generateRandomDistanceRatio()
    expect(ratio).not.toBe(0)
    expect(ratio).toBeLessThan(1)
    expect(ratio).toBeGreaterThan(-1)
  }
})

it('[PolySpace] [utils] [generateRandomNaturalNumber]', () => {
  let count = 100
  while (--count > 0) {
    const upperLimit = Math.random() * Number.MAX_SAFE_INTEGER
    const ratio = generateRandomNaturalNumber(upperLimit)
    expect(ratio % 1).toBe(0)
    expect(ratio).toBeLessThan(upperLimit)
    expect(ratio).toBeGreaterThan(-1)
  }
})

it('[PolySpace] [utils] [generateRandomSafeNumber]', () => {
  let count = 100
  while (--count > 0) {
    const limit = Math.random() * Number.MAX_SAFE_INTEGER
    const safeNumber = generateRandomSafeNumber(limit)
    expect(safeNumber).not.toBe(0)
    expect(safeNumber).toBeLessThan(limit)
    expect(safeNumber).toBeGreaterThan(-limit)
  }
})

it('[PolySpace] [utils] [repeat]', () => {
  expect(repeat(() => 0)).toEqual([0])
  expect(repeat(() => 0, 3)).toEqual([0, 0, 0])
  let count = 0
  expect(repeat(() => count++, 3)).toEqual([0, 1, 2])
})

it('[PolySpace] [utils] [diffNomials / isSameNomials]', () => {
  expect(diffNomials([], [1])).toEqual([1])
  expect(diffNomials([0], [1])).toEqual([1])
  expect(diffNomials([0, 0, 3], [1, -1, 2])).toEqual([1, -1, -1])
  expect(diffNomials([3, 2, 1], [2, 1])).toEqual([-1, -1, -1])
  expect(diffNomials([3, 2, 1], [])).toEqual([-3, -2, -1])

  expect(isSameNomials([1], [1])).toBe(true)
  expect(isSameNomials([1], [1, 0])).toBe(true)
  expect(isSameNomials([0], [0])).toBe(true)
  expect(isSameNomials([2], [2, 0])).toBe(true)
  expect(isSameNomials([0], [0, 0, 0, 0])).toBe(true)
  expect(isSameNomials([0], [1])).toBe(false)
  expect(isSameNomials([2], [1])).toBe(false)
})

it('[PolySpace] [utils]  [euclideanDistance]', () => {
  expect(euclideanDistance([], [])).toBe(0)
  expect(euclideanDistance([0, 0], [])).toBe(0)
  expect(euclideanDistance([1, 1, 1], [])).toBe(Math.sqrt(3))
  expect(euclideanDistance([2, 2, 2], [1, 1, 1])).toBe(Math.sqrt(3))
  
  const diffs = diffNomials([0, 0, 3], [1, -1, 2])
  expect(euclideanDistance(diffs, [])).toBe(Math.sqrt(3))
})