const {
  parseTrekkingLog,
  trekkingErrorTranslation
} = require('../src/Trekker')
const {
  getPrintFunc
} = require('../src/utils')
const Space = require('../src/Space')
const trekkingLog = require('./data.-2+3x')
const log = parseTrekkingLog(trekkingLog).map(item => [item[0], item[1]])
const printFunc = getPrintFunc('trek-error')

it('Trekker.js [trekkingErrorTranslation]', async () => {
  await examLogTrekking({
    log,
    timeBudget: 1,
    showVisitedPoints: true,
    printFunc
  })
})

async function examLogTrekking ({
  log,
  solution,
  timeBudget,
  printPrecision = 4,
  countBudget = Infinity,
  showVisitedPoints = false,
  showCheckedPoints = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(trekkingErrorTranslation)
  expect(space.translation).toBe(trekkingErrorTranslation)
  // TODO: Set search space boundary
  // eg. positive integers

  space.take([log], [0]).setup([1, 1, 1])

  const point = await space.findThePoint({timeBudget, countBudget, maxDimensions: 3})
  await space.printSolution({
    precision: printPrecision,
    showVisitedPoints,
    showCheckedPoints,
    logSampleAmount,
    printFunc
  })

  expect(space.minDistance).toBeCloseTo(0)
  if (solution) expect(
    point.isCloseTo(new Point(solution), 3)
  ).toBe(true)
}