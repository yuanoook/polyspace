import Space from '../src/Space'
import {
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula
} from '../src/utils'
import parabolicAntennaCurveData from '../spec/data/data.delon'
import { parseDelonsInputsExpectations } from '../spec/data/data.delon.parse'

(async() => {
// Complex 2nd exponential example provided by Zoe
  // await examPolyNumbers({
  //   origin: [
  //     {value: 0, leftLimit: -100, rightLimit: 100, baseUnit: 0.5},
  //     {value: 0, leftLimit: -100, rightLimit: 100, baseUnit: 0.5},
  //     {value: 0, leftLimit: -100, rightLimit: 100, baseUnit: 0.5}
  //   ],
  //   inputs: [1, 4, 3],
  //   expectations: [4, 1, 1],
  //   timeBudget: 10,
  //   showVisitedPoints: true,
  //   logSampleAmount: 10000000000,
  //   maxDimensions: 3,
  //   printFunc
  // })

// Interesting failure case - Example provided by Delon
  // await examPolyNumbers({
  //   inputs: [2, 2],
  //   expectations: [2, 3],
  //   maxDimensions: 3
  // })

// Simple 2nd exponential example provided by Delon
  // await examPolyNumbers({
  //   inputs: [0, 2, 4],
  //   expectations: [1, 3, 4],
  //   timeBudget: 10
  // })

// Multiple points failure example
  // await examPolyNumbers({
  //   inputs: [0, 1, 2, 3, 4, 50],
  //   expectations: [1, -2, 3, -4, 2, -2],
  //   timeBudget: 60,
  //   printFunc
  // })

  await examPolyNumbers({
    // This is beautiful - https://plotly.com/~yuanoook/5/
    inputs: [3, 5],
    expectations: [3, 4],
    printPrecision: 4
  })

  // await examPolyNumbers({
  //   inputs: [0, 1, 2],
  //   expectations: [0, 1, 4],
  //   timeBudget: 60
  // })

  // await examPolyNumbers({
  //   inputs: [0, 1, 2],
  //   expectations: [0, 1, 4].map((e, i) => e + i + 4),
  //   printFunc
  // })

  await examPolyNumbers({
    ...parseDelonsInputsExpectations(parabolicAntennaCurveData),
    maxDimensions: 3,
    printPrecision: 0,
    showVisitedPoints: true,
    timeBudget: 60
  })
})()

async function examPolyNumbers ({
  origin,
  inputs,
  expectations,
  timeBudget,
  printPrecision = 4,
  trialBudget = Infinity,
  maxDimensions = Infinity,
  startFormula = '',
  showVisitedPoints = false,
  showCheckedPoints = false,
  logSampleAmount = 100,
  printFunc
}) {
  const space = new Space(polyNumbersTranslation)
  origin = origin || parsePolyNumbersFormula(startFormula)
  space.take(inputs, expectations).setup(origin)

  await space.findThePoint({timeBudget, trialBudget, maxDimensions})
  await space.printSolution({
    precision: printPrecision,
    solutionFormatter: polyNumbersFormatter,
    showVisitedPoints,
    showCheckedPoints,
    logSampleAmount,
    printFunc
  })
}



