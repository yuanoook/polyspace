const solution = require('./solution')
const { trace } = require('mathjs')

const patience = 1000

function lossFn (expectation, prediction) {
  return (expectation - prediction) ** 2
}

function fitExpectation(input, expectation) {
  let trial = 0
  while (true) {
    const prediction = solution.solve(input)
    const loss = lossFn(expectation, prediction)
    const yes = solution.canYouDoBetter(loss)
    if (!yes) {
      report(trial)
      break
    }

    if (++trial > patience) {
      console.error('Run out of patience!')
      report(trial)
      break
    }

    solution.update(input, expectation)
  }
}

function report (trial) {
  console.log('Total trial: ', trial)
  console.log(solution.getCurrentPolyNumbers())
}

function mc (input, expectation) {
  if (expectation === undefined) {
    expectation = solution.solve(input)
  } else {
    fitExpectation(input, expectation)
  }
  return expectation
}

module.exports = mc