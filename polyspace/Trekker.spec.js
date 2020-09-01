const {
  sum,
  makeF,
  trekking,
  parseTrekkingLog
} = require('./Trekker')
const Space = require('./Space')
const trekkingLog = require('./data.-2+3x')

it('trekking.js', async () => {
  expect(sum(1,2,3)).toBe(6)
  expect(sum([1,2,3])).toBe(6)

  const log = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  expect(makeF(log, 0)(2)).toBe(2)
  expect(makeF(log, 2)(0)).toBe(1)
  expect(makeF(log, 2)(1)).toBe(1.5)
  expect(makeF(log, 2)(2)).toBe(2)
  expect(makeF(log, 3)(3)).toBe(3)
  expect(makeF(log, 4)(4)).toBe(4)
})

it('Trekker.spec.js', async () => {
  expect(1).toBe(1)
  expect(typeof trekkingLog).toBe('string')

  const log = parseTrekkingLog(trekkingLog)
  expect(typeof log).toBe('object')
  expect(Array.isArray(log)).toBe(true)
  expect(Array.isArray(log[0])).toBe(true)

  // Trekker function

  // F(n+m) = F(n) + [F(n) - F(n-m)]
  //        = 2 * F(n) - F(n-m)

  // F(n+tm) = F(n) + t[F(n) - F(n-m)]
  //           (t+1) * F(n) - t * F(n-m)

  // F(n) = Sum(log(n-r)...log(n+r)) / (2r+1)

  // What are the best numbers for - m, t, r ?
})

function trekkingTranslation(nomials) {
  return log => calculateTrekkingError(nomials, log)
}

function calculateTrekkingError(nomials, log) {
  return log.reduce((error, ...args) => error + logTrekkingError(nomials, ...args), 0)
}

function logTrekkingError(nomials, point, index, log) {
  const length = log.length
  const [m, t, r] = nomials
}

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