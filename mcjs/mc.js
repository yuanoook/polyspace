const solution = require('./solution')
const threshold = 0.00000001;

function fitExpectation(input, expectation) {
  while (true) {
    const currentExpectation = solution.solve(input)
    let gap = expectation - currentExpectation
    const error = gap * gap
    if (error <= threshold) break;

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