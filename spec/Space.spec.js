const Point = require('../src/Point')
const Space = require('../src/Space')
const {
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula,
  getPrintFunc
} = require('../src/utils')
const parabolicAntennaCurveData = require('./data/data.delon')
const printFunc = getPrintFunc('space')

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
    // This is beautiful - https://plotly.com/~yuanoook/5/
    inputs: [1, 2],
    expectations: [1, 4],
    printPrecision: 4,
    // showCheckedPoints: true,
    showVisitedPoints: true,
    logSampleAmount: 10000000000,
    timeBudget: 10,
    maxDimensions: 2,
    printFunc
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

  // await examPolyNumbers({
  //   // startFormula: 'f(x) = -21.185792266795538 + 5.731037866496542e-11x + 0.0000864332833576694x²',
  //   ...parseDelonsInputsExpectations(parabolicAntennaCurveData),
  //   maxDimensions: 3,
  //   printPrecision: 0,
  //   showVisitedPoints: true,
  //   logSampleAmount: 10000000000,
  //   printFunc
  // })
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
    logSampleAmount,
    printFunc
  })
  // printDesmos({inputs, expectations})

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
