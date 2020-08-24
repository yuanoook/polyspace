const Point = require('./Point')
const Space = require('./Space')
const { polyNumbersTranslation } = require('./utils')

it('[PolySpace] [Space] [Basics]', async () => {
  await exam({
    inputs: [0, 1],
    expectations: [0, 1],
    solution: [0, 1]
  })
  await exam({
    inputs: [3, 4],
    expectations: [4, 3],
    solution: [7, -1],
    timeBudget: 3
  })
  await exam({
    inputs: [0, 1, 2],
    expectations: [0, 1, 4],
    solution: [0, 0, 1],
    timeBudget: 5
  })
})

async function exam ({inputs, expectations, solution, timeBudget = 1}) {
    const space = new Space(polyNumbersTranslation)
    expect(space.translation).toBe(polyNumbersTranslation)
    space.take(inputs, expectations)
    const theBestPoint = await space.findThePoint(timeBudget)
    space.printSolution()
    expect(theBestPoint.isCloseTo(new Point(solution), 3)).toBe(true)
}
