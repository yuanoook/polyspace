const solutions = [
  input => input,
  input => input + 0.999,
  input => input + 1
];
let solutionIndex = 0;

function update() {
  solutionIndex ++
  while (solutionIndex >= solutions.length) {
    solutionIndex -= solutions.length
  }
}

function get () {
  return solutions[solutionIndex]
}

function solve(input) {
  return get()(input)
}

module.exports = {
  update,
  solve
}