const solutions = [
  input => input,
  input => input + 1
];

const threshold = 0;
let solutionIndex = 0;

function updateSolution() {
  solutionIndex ++
  while (solutionIndex >= solutions.length) {
    solutionIndex -= solutions.length
  }
}

function getCurrentSolution () {
  return solutions[solutionIndex]
}

function predict(input) {
  return getCurrentSolution()(input)
}

function fitExpectation(input, expectation) {
  while (true) {
    const currentExpectation = predict(input)
    let gap = expectation - currentExpectation
    const error = gap * gap
    if (error <= threshold) break;

    updateSolution(input, expectation)
  }
}

function mc (input, expectation) {
  if (expectation === undefined) {
    expectation = predict(input)
  } else {
    fitExpectation(input, expectation)
  }
  return expectation
}

module.exports = mc