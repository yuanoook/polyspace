const Point = require('./Point')
const Space = require('./Space')
const {
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula
} = require('./utils')
const parabolicAntennaCurveData = require('./data.delon')

it('[PolySpace] [Space] [Basics]', async () => {
// Complex 2nd exponential example provided by Zoe
//   await examPolyNumbers({
//     inputs: [1, 4, 3],
//     expectations: [4, 1, 1],
//     timeBudget: 50
//   })

// Interesting failure case - Example provided by Delon
//   await examPolyNumbers({
//     inputs: [2, 2],
//     expectations: [2, 3]
//   })

// Simple 2nd exponential example provided by Delon
//   await examPolyNumbers({
//     inputs: [0, 2, 4],
//     expectations: [1, 3, 4],
//     timeBudget: 10
//   })

// Multiple points failure example
//   await examPolyNumbers({
//     inputs: [0, 1, 2, 3, 4, 50],
//     expectations: [1, -2, 3, -4, 2, -2],
//     timeBudget: 20
//   })

  await examPolyNumbers({
    inputs: [30, 40],
    expectations: [40, -30],
    printPrecision: 4,
    showCheckedPoints: true,
    showVisitedPoints: true,
    logSamplingRate: 1 / 1000000,
    maxDimensions: 2
  })

//   await examPolyNumbers({
//     inputs: [0, 1, 2],
//     expectations: [0, 1, 4],
//     solution: [0, 0, 1]
//   })
//   await examPolyNumbers({
//     inputs: [0, 1, 2],
//     expectations: [0, 1, 4].map((e, i) => e + i + 4)
//   })

//   await examPolyNumbers({
//     startFormula: 'f(x) = -21.185792266795538 + 5.731037866496542e-11x + 0.0000864332833576694x²',
//     ...parseDelonsInputsExpectations(parabolicAntennaCurveData),
//     maxDimensions: 3,
//     printPrecision: 0,
//     timeBudget: 1000
//   })
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
  logSamplingRate = 1 / 100
}) {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)
  space.take(inputs, expectations).setup(parsePolyNumbersFormula(startFormula))

  const point = await space.findThePoint({timeBudget, countBudget, maxDimensions})
  space.printSolution({
    precision: printPrecision,
    solutionFormatter: polyNumbersFormatter,
    showVisitedPoints,
    showCheckedPoints,
    logSamplingRate
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

function parseDelonsInputsExpectations (str = `600 0`) {
    return str.split('\n').map(x => x.split(/\s+/))
    .reduce(
      ({inputs, expectations}, [i, e]) =>
      ({inputs: inputs.concat(+i), expectations: expectations.concat(+e)}),
      {inputs: [], expectations: []}
    )
}
