const {
  sum,
  generateSmoothLog,
  generateTrekking,
  parseTrekkingLog,
  allTrekkingError,
  totalTrekkingError,
  trekkingError,
  trekkingTranslation
} = require('./Trekker')
const Space = require('./Space')
const trekkingLog = require('./data.-2+3x')

it('Trekker.js [sum]', async () => {
  expect(sum(1,2,3)).toBe(6)
  expect(sum([1,2,3])).toBe(6)
})

it('Trekker.js [generateSmoothLog]', async () => {
  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(generateSmoothLog(log, 0)(2)).toBe(2)
  expect(generateSmoothLog(log, 2)(0)).toBe(1)
  expect(generateSmoothLog(log, 2)(1)).toBe(1.5)
  expect(generateSmoothLog(log, 2)(2)).toBe(2)
  expect(generateSmoothLog(log, 3)(3)).toBe(3)
  expect(generateSmoothLog(log, 4)(4)).toBe(4)
})

it('Trekker.js [generateTrekking]', async () => {
  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(generateTrekking(log, 0)(0)).toEqual([1, 0])
  expect(generateTrekking(log, 0)(1)).toEqual([2, 2])
  expect(generateTrekking(log, 1, 2, 2)(3)).toEqual([7, 7])
  expect(generateTrekking(log, 1, 2, 3)(3)).toEqual([9, 9])
})

it('Trekker.js [trekkingError]', async () => {
  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(trekkingError([0, 1, 1], null, 0, log)).toBe(1)

  expect(trekkingError([0, 1, 1], null, 1, log)).toBe(0)
  expect(trekkingError([0, 1, 1], null, 2, log)).toBe(0)
  expect(trekkingError([0, 1, 1], null, 3, log)).toBe(0)

  expect(trekkingError([1, 2, 2], null, 3, log)).toBe(0)
  expect(trekkingError([1, 2, 3], null, 3, log)).toBe(0)
})

it('Trekker.js [allTrekkingError]', async () => {
  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(allTrekkingError([0, 1, 1], log)).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 1])
  expect(allTrekkingError([0, 1, 2], log)).toEqual([4, 0, 0, 0, 0, 0, 0, 0, 1, 4])
  expect(allTrekkingError([0, 1, 3], log)).toEqual([9, 0, 0, 0, 0, 0, 0, 1, 4, 9])
  expect(allTrekkingError([0, 2, 3], log)).toEqual([36, 9, 0, 0, 1, 4, 9, 16, 25, 36])

  expect(allTrekkingError([1, 1, 3], log)).toEqual([1, 2.25, 0, 0, 0, 0, 0, 1, 4, 1])
  expect(allTrekkingError([2, 1, 3], log)).toEqual([0.25, 1, 2.25, 0, 0, 0, 0, 1, 0, 0.25])
  expect(allTrekkingError([3, 1, 1], log)).toEqual([1, 0.25, 0, 0.25, 0, 0, 0, 1, 2.25, 1])
})

it('Trekker.js [totalTrekkingError]', async () => {
  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(totalTrekkingError([0, 1, 1], log)).toBe(2)
  expect(totalTrekkingError([0, 1, 2], log)).toBe(9)
})

it('Trekker.js [parseTrekkingLog]', async () => {
  expect(1).toBe(1)
  expect(typeof trekkingLog).toBe('string')

  const log = parseTrekkingLog(trekkingLog)
  expect(typeof log).toBe('object')
  expect(Array.isArray(log)).toBe(true)
  expect(Array.isArray(log[0])).toBe(true)
})

async function examPolyNumbers ({
  inputs,
  expectations,
  solution,
  timeBudget,
  printPrecision = 4,
  countBudget = Infinity,
  maxDimensions = Infinity,
  startFormula = '',
  showVisitedPoints = false,
  showCheckedPoints = false,
  showMatlabScatter3 = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)
  space.take(inputs, expectations).setup(parsePolyNumbersFormula(startFormula))

  const point = await space.findThePoint({timeBudget, countBudget, maxDimensions})
  await space.printSolution({
    precision: printPrecision,
    solutionFormatter: polyNumbersFormatter,
    showVisitedPoints,
    showCheckedPoints,
    showMatlabScatter3,
    logSampleAmount,
    printFunc
  })
  // printDesmos({inputs, expectations})

  expect(space.minDistance).toBeCloseTo(0)
  if (solution) expect(
    point.isCloseTo(new Point(solution), 3)
  ).toBe(true)
}