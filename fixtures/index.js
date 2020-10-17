import Point from '../src/Point'
import Space from '../src/Space'

import {
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula
} from '../src/utils'
import parabolicAntennaCurveData from '../spec/data/data.delon'

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
  //   solution: [0, 0, 1],
  //   timeBudget: 60
  // })

  // await examPolyNumbers({
  //   inputs: [0, 1, 2],
  //   expectations: [0, 1, 4].map((e, i) => e + i + 4),
  //   printFunc
  // })

  // await examPolyNumbers({
  //   // The old one, haha, tried 10+ times manually for half hour
  //   // startFormula: `f(x) = -21.185792266795538 + 5.731037866496542e-11x + 0.0000864332833576694x²`,

  //   // The new one, reached in one go, what a big improvement
  //   // startFormula: `f(x) = -21.185792952095674 + 2.4253114229740615e-11x + 0.00008643328341505862x²`
  //   ...parseDelonsInputsExpectations(parabolicAntennaCurveData),
  //   maxDimensions: 3,
  //   printPrecision: 0,
  //   showVisitedPoints: true,
  //   logSampleAmount: 10000000000,
  //   timeBudget: 60,
  //   printFunc
  // })
})()

async function examPolyNumbers ({
  origin,
  inputs,
  expectations,
  solution,
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
