const {
  parseTrekkingLog,
  trekkingErrorTranslation
} = require('./Trekker')
const { printFunc } = require('./utils')
const Space = require('./Space')
const trekkingLog = require('./data.-2+3x')
const log = parseTrekkingLog(trekkingLog).map(item => [item[0], item[1]])

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
  showMatlabScatter3 = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(trekkingErrorTranslation)
  expect(space.translation).toBe(trekkingErrorTranslation)
  space.take([log], [0]).setup([0, 0, 0])

  const point = await space.findThePoint({timeBudget, countBudget, maxDimensions: 3})
  await space.printSolution({
    precision: printPrecision,
    showVisitedPoints,
    showCheckedPoints,
    showMatlabScatter3,
    logSampleAmount,
    printFunc
  })

  expect(space.minDistance).toBeCloseTo(0)
  if (solution) expect(
    point.isCloseTo(new Point(solution), 3)
  ).toBe(true)
}