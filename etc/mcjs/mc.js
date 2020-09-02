const solution = require('./solution')
const PATIENCE = 1000

function lossFn (expectation, prediction) {
  return (expectation - prediction) ** 2
}

function overallLossFn (inputs_expectations) {
  return inputs_expectations.reduce((r, [input, expectation]) => {
    return r + lossFn(expectation, solution.predict(input))
  }, 0) / inputs_expectations.length
}

const inputs_expectations_memory = []
function fitExpectation(input, expectation) {
  inputs_expectations_memory.push([input, expectation])

  let trial = 0
  while (true) {
    const loss = overallLossFn(inputs_expectations_memory)
    const yes = solution.canYouDoBetter(loss)
    if (!yes) {
      report(trial)
      break
    }

    if (++trial > PATIENCE) {
      console.error('Run out of patience!')
      report(trial)
      break
    }

    solution.update(input, expectation)
  }
}

function report (trial) {
  console.log('Total trial: ', trial)
  console.log('Models: ', solution.modelMemory.splice(-5))
  console.log('Loss: ', solution.lossMemory.splice(-5))
  console.log('I_Es: ', inputs_expectations_memory)
}

function mc (input, expectation) {
  if (expectation === undefined) {
    expectation = solution.predict(input)
  } else {
    fitExpectation(input, expectation)
  }
  return expectation
}

module.exports = mc