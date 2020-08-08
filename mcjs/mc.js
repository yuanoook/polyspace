const solution = require('./solution')
solution.init()

const threshold = {
  gap: 0.0000000001,
  patience: 10000000
}

function lossFn (expectation, prediction) {
  let gap = expectation - prediction
  let error = gap * gap
  return error <= threshold.gap ? 0 : error
}

function fitExpectation(input, expectation) {
  let trial = 0
  while (true) {
    const prediction = solution.solve(input)
    const loss = lossFn(expectation, prediction)
    solution.feedback(loss)
    // if loss does not reduce anymore, stop
    if (!loss) {
      console.log(solution.getCurrentPolyNumbers())
      break
    }

    if (++trial > threshold.patience) {
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