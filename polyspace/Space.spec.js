const Point = require('./Point')
const Space = require('./Space')
const { polyNumbersTranslation } = require('./utils')

it('[PolySpace] [Space] [Basics]', async () => {
  await exam({
    inputs: [0, 100],
    expectations: [1, 100]
  })
  await exam({
    inputs: [0, 100],
    expectations: [1, 1.5]
  })
  await exam({
    inputs: [3, 4],
    expectations: [4, 3],
    solution: [7, -1]
  })
  await exam({
    inputs: [0, 1, 2],
    expectations: [0, 1, 4],
    solution: [0, 0, 1]
  })
})

async function exam ({
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
  space.printSolution(4)

  expect(space.minDistance).toBeCloseTo(0)

  if (solution) expect(
    point.isCloseTo(new Point(solution), 3)
  ).toBe(true)
}
