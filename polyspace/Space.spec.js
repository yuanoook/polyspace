const Point = require('./Point')
const Space = require('./Space')
const {
  polyNumbersTranslation,
  polyNumbersFormatter
} = require('./utils')

it('[PolySpace] [Space] [Basics]', async () => {
  await examPolyNumbers({
    inputs: [3, 4],
    expectations: [4, 3],
    solution: [7, -1]
  })
  await examPolyNumbers({
    inputs: [0, 1, 2],
    expectations: [0, 1, 4],
    solution: [0, 0, 1]
  })
  await examPolyNumbers({
    inputs: [0, 1, 2],
    expectations: [0, 1, 4].map((e, i) => e + i + 4)
  })
  await examPolyNumbers({
    inputs: [0, 1, 2, 3, 4, 50],
    expectations: [1, -2, 3, -4, 2, -2],
    timeBudget: 20
  })
})

async function examPolyNumbers ({
  inputs,
  expectations,
  solution,
  timeBudget,
  countBudget = Infinity
}) {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)
  space.take(inputs, expectations)

  const point = await space.findThePoint({timeBudget, countBudget})
  space.printSolution({
    precision: 4,
    solutionFormatter: polyNumbersFormatter
  })
  printDesmos({inputs, expectations})

  expect(space.minDistance).toBeCloseTo(0)
  if (solution) expect(
    point.isCloseTo(new Point(solution), 3)
  ).toBe(true)
}

function printDesmos ({inputs, expectations}) {
  const dataTable = inputs.map(
    (input, index) => `${input}, ${expectations[index]}`
  ).join('\n')

  console.log(`Plot on https://www.desmos.com/calculator \n${dataTable}`)
}
