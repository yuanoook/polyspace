const {
  generateRandomDistanceRatio,
  generateRandomNaturalNumber,
  generateRandomSafeNumber,
  repeat
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
