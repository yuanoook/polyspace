function parseDelonsInputsExpectations (str = `600 0`) {
  return str.split('\n').map(x => x.split(/\s+/))
  .reduce(
    ({inputs, expectations}, [i, e]) =>
    ({inputs: inputs.concat(+i), expectations: expectations.concat(+e)}),
    {inputs: [], expectations: []}
  )
}

module.exports = {
  parseDelonsInputsExpectations
}