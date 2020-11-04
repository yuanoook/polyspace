module.exports = {
  getInNetworkPoints (includeSelf = true) {
    const results = this.getChainPoints()
    let index = 0
    while (results[index]) {
      const point = results[index]
      point.getChainPoints(false).forEach(point => {
        if (results.indexOf(point) < 0) results.push(point)
      })
      index ++
    }
    if (!includeSelf) results.shift()
    return results
  },

  isInNetwork (point) {
    return this.getInNetworkPoints().indexOf(point) > -1
  }
}
