const {
  parseTrekkingLog,
  trekkingErrorTranslation
} = require('../src/Trekker')
const {
  getPrintFunc
} = require('../src/utils')
const Space = require('../src/Space')
const trekkingLog = require('./data/data.-2+3x')
const log = parseTrekkingLog(trekkingLog).map(item => [item[0], item[1]])
const printFunc = getPrintFunc('trek-error')

it('Trekker.js [trekkingErrorTranslation]', async () => {
  await examLogTrekking({
    log,
    trialBudget: 100,
    showVisitedPoints: true,
    printFunc
  })
})

async function examLogTrekking ({
  log,
  solution,
  timeBudget,
  printPrecision = 4,
  trialBudget = Infinity,
  showVisitedPoints = false,
  showCheckedPoints = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(trekkingErrorTranslation)
  expect(space.translation).toBe(trekkingErrorTranslation)

  space.take([log], [0]).setup([
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'smoothRadius'},
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'predictBaseStep'},
    {value: 10, leftLimit: 1, rightLimit: 1000, name: 'predictTimes'}
  ])

  const point = await space.findThePoint({timeBudget, trialBudget, maxDimensions: 3})
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