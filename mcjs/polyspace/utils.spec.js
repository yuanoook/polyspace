const {
  generateRandomDistanceRatio,
  generateRandomNatureNumber
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

it('[PolySpace] [utils] [generateRandomNatureNumber]', () => {
  let count = 100
  while (--count > 0) {
    const upperLimit = Math.random() * Number.MAX_SAFE_INTEGER
    const ratio = generateRandomNatureNumber(upperLimit)
    expect(ratio % 1).toBe(0)
    expect(ratio).toBeLessThan(upperLimit)
    expect(ratio).toBeGreaterThan(-1)
  }
})
