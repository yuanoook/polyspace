const Point = require('./Point')
const Space = require('./Space')
const {
  polyNumbersTranslation,
  polyNumbersFormatter
} = require('./utils')

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
    inputs: [3, 4],
    expectations: [4, 3],
    printPrecision: 4
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

//   await examPolyNumbersForDelonWork()
})

async function examPolyNumbers ({
  inputs,
  expectations,
  solution,
  timeBudget,
  printPrecision = 0,
  countBudget = Infinity
}) {
  const space = new Space(polyNumbersTranslation)
  expect(space.translation).toBe(polyNumbersTranslation)
  space.take(inputs, expectations)

  const point = await space.findThePoint({timeBudget, countBudget})
  space.printSolution({
    precision: printPrecision,
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

async function examPolyNumbersForDelonWork () {
  const {is: inputs, es: expectations} = parseInputsExpectations()
  await examPolyNumbers({
    inputs,
    expectations
  })
}

function parseInputsExpectations (str = `652 6.019145569
678 9.211675609
704 12.52687435
730 15.96450881
756 19.52433339
782 23.20613668
808 27.00962301
834 30.93445804
2498 523.0521131
2524 534.4688528
2550 545.9995886
2576 557.6442177
2602 569.4026322
2628 581.274718
2654 593.2603553
2680 605.3594177
2706 617.5717724
4084 1417.308357
4110 1434.937441
4136 1452.649011
4162 1470.443452
4188 1488.321368
4214 1506.283616
4240 1524.331331
4266 1542.46595
4292 1560.689229
4318 1579.003243
4344 1597.410375
4370 1615.913283
4396 1634.514841
4422 1653.218067
4448 1672.026036`) {
    return str.split('\n').map(x => x.split(' '))
    .reduce(
      ({is, es}, [i, e]) =>
      ({is: is.concat(+i), es: es.concat(+e)}),
      {is: [], es: []}
    )
}
