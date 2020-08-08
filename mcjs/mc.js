const solution = require('./solution')
solution.init()

const patience = 10000000

function lossFn (expectation, prediction) {
  return (expectation - prediction) ** 2
}

function fitExpectation(input, expectation) {
  let trial = 0
  while (true) {
    const prediction = solution.solve(input)
    const loss = lossFn(expectation, prediction)
    const improvability = solution.feedback(loss)
    if (!improvability) {
      console.log(solution.getCurrentPolyNumbers())
      break
    }

    if (++trial > patience) {
      console.error('Run out of patience!')
      break;
    }

    solution.update(input, expectation)
  }
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