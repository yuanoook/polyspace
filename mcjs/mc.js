const solution = require('./solution')
const threshold = {
  gap: 0.00000001,
  patience: 10000000
}

function fitExpectation(input, expectation) {
  let trial = 0
  while (true) {
    const currentExpectation = solution.solve(input)
    let gap = expectation - currentExpectation
    const error = gap * gap
    if (error <= threshold.gap) break;

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