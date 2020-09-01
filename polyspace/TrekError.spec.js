const {
  parseTrekkingLog,
  trekkingErrorTranslation
} = require('./Trekker')
const Space = require('./Space')
const trekkingLog = require('./data.-2+3x')
const log = parseTrekkingLog(trekkingLog).map(item => [item[0], item[1]])

it('Trekker.js [trekkingErrorTranslation]', async () => {
  expect(1).toBe(1)
  examLogTrekking({
    log
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
  showMatlabScatter3 = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(trekkingErrorTranslation)
  expect(space.translation).toBe(trekkingErrorTranslation)
  space.take(log, 0).setup([0, 0, 0])

  const point = await space.findThePoint({timeBudget, countBudget, maxDimensions: 3})
  await space.printSolution({
    precision: printPrecision,
    // solutionFormatter: polyNumbersFormatter,
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