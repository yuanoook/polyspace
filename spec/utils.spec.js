const {
  randomDistanceRatio,
  randomPositiveDistanceRatio,
  validateDistanceRatio,
  randomNaturalNumber,
  randomSafeNumber,
  randomPositiveSafeNumber,
  validatePositive,
  repeat,
  add2Nomials,
  diffNomials,
  isSameNomials,
  euclideanDistance,
  calculatePolyNumbers,
  polyNumbersTranslation,
  parsePolyNumbersFormula
} = require('../src/utils')

it('[PolySpace] [utils] [randomDistanceRatio]', () => {
  expect(randomDistanceRatio()).not.toBe(0)
  expect(randomDistanceRatio()).toBeLessThan(1)
  expect(randomDistanceRatio()).toBeGreaterThan(-1)
  expect(randomPositiveDistanceRatio() > 0).toBe(true)
  expect(randomDistanceRatio(-1) < 0).toBe(true)
})

it('[PolySpace] [utils] [validateDistanceRatio]', () => {
  expect(() => validateDistanceRatio(0)).toThrow()
  expect(() => validateDistanceRatio(1)).toThrow()
  expect(() => validateDistanceRatio(-1)).toThrow()
  expect(() => validateDistanceRatio(2)).toThrow()
  expect(() => validateDistanceRatio(-2)).toThrow()
  expect(() => validateDistanceRatio(0.5)).not.toThrow()
  expect(() => validateDistanceRatio(-0.5)).not.toThrow()
  expect(() => validateDistanceRatio(0.5, -1)).toThrow()
  expect(() => validateDistanceRatio(-0.5, 1)).toThrow()
})

it('[PolySpace] [utils] [randomNaturalNumber]', () => {
  let count = 100
  while (--count > 0) {
    const upperLimit = Math.random() * Number.MAX_SAFE_INTEGER
    const ratio = randomNaturalNumber(upperLimit)
    expect(ratio % 1).toBe(0)
    expect(ratio).toBeLessThan(upperLimit)
    expect(ratio).toBeGreaterThan(-1)
  }

  expect(randomNaturalNumber(0)).toBe(0)
  expect([0, 1, 2, 3].indexOf(randomNaturalNumber(4)) > -1).toBe(true)
})

it('[PolySpace] [utils] [randomSafeNumber]', () => {
  let limit
  expect(randomSafeNumber(limit = randomPositiveSafeNumber())).not.toBe(0)
  expect(randomSafeNumber(limit = randomPositiveSafeNumber())).toBeLessThan(limit)
  expect(randomSafeNumber(limit = randomPositiveSafeNumber())).toBeGreaterThan(-limit)
  expect(randomPositiveSafeNumber())
})

it('[PolySpace] [utils] [validatePositive]', () => {
  expect(() => validatePositive(-1)).toThrow()
  expect(() => validatePositive(0)).toThrow()
  expect(() => validatePositive(1)).not.toThrow()
})

it('[PolySpace] [utils] [repeat]', () => {
  expect(repeat(() => 0)).toEqual([0])
  expect(repeat(() => 0, 3)).toEqual([0, 0, 0])
  let count = 0
  expect(repeat(() => count++, 3)).toEqual([0, 1, 2])
})

it('[PolySpace] [utils] [add2Nomials]', () => {
  expect(add2Nomials([], [1])).toEqual([1])
  expect(add2Nomials([0], [1])).toEqual([1])
  expect(add2Nomials([0, 0, 3], [1, -1, 2])).toEqual([1, -1, 5])
  expect(add2Nomials([3, 2, 1], [2, 1])).toEqual([5, 3, 1])
  expect(add2Nomials([3, 2, 1], [])).toEqual([3, 2, 1])
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

it('[PolySpace] [utils] [euclideanDistance]', () => {
  expect(euclideanDistance([], [])).toBe(0)
  expect(euclideanDistance([0, 0], [])).toBe(0)
  expect(euclideanDistance([1, 1, 1], [])).toBe(Math.sqrt(3))
  expect(euclideanDistance([2, 2, 2], [1, 1, 1])).toBe(Math.sqrt(3))
  
  const diffs = diffNomials([0, 0, 3], [1, -1, 2])
  expect(euclideanDistance(diffs, [])).toBe(Math.sqrt(3))
})


it('[PolySpace] [utils] [calculatePolyNumbers]', () => {
  expect(calculatePolyNumbers([], 0)).toBe(0)

  expect(calculatePolyNumbers([1], 0)).toBe(1)
  expect(calculatePolyNumbers([1], 1)).toBe(1)
  expect(calculatePolyNumbers([1], 2)).toBe(1)
  expect(calculatePolyNumbers([1], 3)).toBe(1)

  expect(calculatePolyNumbers([0, 1], 2)).toBe(2)
  expect(calculatePolyNumbers([1, 1], 2)).toBe(3)

  expect(calculatePolyNumbers([0, 0, 1], 2)).toBe(4)
  expect(calculatePolyNumbers([0, 0, 1], 3)).toBe(9)
  expect(calculatePolyNumbers([0, 0, 1], 4)).toBe(16)
  expect(calculatePolyNumbers([0, 0, 1], 5)).toBe(25)

  expect(calculatePolyNumbers([0, 1, 1], 2)).toBe(0*2**0 + 2**1 + 2**2)
  expect(calculatePolyNumbers([0, 1, 1], 3)).toBe(0*3**0 + 3**1 + 3**2)
  expect(calculatePolyNumbers([0, 1, 1], 4)).toBe(0*4**0 + 4**1 + 4**2)

  expect(calculatePolyNumbers([5, 1, 1], 2)).toBe(5*2**0 + 2**1 + 2**2)
  expect(calculatePolyNumbers([6, 1, 1], 3)).toBe(6*3**0 + 3**1 + 3**2)
  expect(calculatePolyNumbers([7, 1, 1], 4)).toBe(7*4**0 + 4**1 + 4**2)

  expect(polyNumbersTranslation([5, 1, 1])(2)).toBe(calculatePolyNumbers([5, 1, 1], 2))
  expect(polyNumbersTranslation([6, 1, 1])(3)).toBe(calculatePolyNumbers([6, 1, 1], 3))
  expect(polyNumbersTranslation([7, 1, 1])(4)).toBe(calculatePolyNumbers([7, 1, 1], 4))
})

it('[PolySpace] [utils] [parsePolyNumbersFormula]', () => {
  expect(parsePolyNumbersFormula('')).toEqual([0])
  expect(parsePolyNumbersFormula('-11')).toEqual([-11])
  expect(parsePolyNumbersFormula('111')).toEqual([111])
  expect(parsePolyNumbersFormula('-0')).toEqual([0])
  expect(parsePolyNumbersFormula('x')).toEqual([0, 1])
  expect(parsePolyNumbersFormula('-x')).toEqual([0, -1])
  expect(parsePolyNumbersFormula('-x³')).toEqual([0, 0, 0, -1])
  expect(parsePolyNumbersFormula('f(x) = 1 - x⁵')).toEqual([1, 0, 0, 0, 0, -1])
  expect(parsePolyNumbersFormula('f(x) = 1 - 11.3x³ - x⁵')).toEqual([1, 0, 0, -11.3, 0, -1])
  expect(parsePolyNumbersFormula('f(x) = -45.44 + 0.000081x²')).toEqual(
    [-45.44, 0, 0.000081]
  )
  expect(parsePolyNumbersFormula('f(x) = -45.44 + 0.024x + 0.000081x²')).toEqual(
    [-45.44, 0.024, 0.000081]
  )
  expect(parsePolyNumbersFormula('f(x) = -45.44 + 0.024x + 9.973508529750448e-7x²')).toEqual(
    [-45.44, 0.024, 9.973508529750448e-7]
  )
})
