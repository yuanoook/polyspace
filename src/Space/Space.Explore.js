const {
  isCloseToPeriod,
  sleep
} = require('../utils')
const SpaceConst = require('./Space.Const')

module.exports = {
  findRandomMinNeighbor () {
    return this.minDistancePoint.findRandomNeighbor()
  },

  findBiNeighbors () {
    return this.minDistancePoint.findBiNeighbors()
  },

  checkBiNeighbors () {
    const biNeighbors = this.findBiNeighbors()
    for (let biNeighbor of biNeighbors)
      if (this.check(biNeighbor)) break
    return biNeighbors
  },

  findBiNeighborsMatrix () {
    return this.minDistancePoint.findBiNeighborsMatrix(this.directionDelta)
  },

  checkBiNeighborsMatrixList (list) {
    for (let point of list)
      if(this.check(point)) return true
    return false
  },

  checkBiNeighborsMatrix () {
    const matrix = this.findBiNeighborsMatrix()
    let matrixIsNotEmpty = false
    let count = 0
    while (count < this.dimension) {
      const list = matrix[this.visitingIndex]
      matrixIsNotEmpty = matrixIsNotEmpty || (list.length > 0)
      if (this.checkBiNeighborsMatrixList(list)) break
      count ++
      this.updateVisitingIndex()
    }
    return matrixIsNotEmpty
  },

  // exploreBiNeighborsMatrix performs 8% faster than exploreBiNeighbors
  // by index preferring & quick breaking
  // Quick breaking contributes the most performance improvement
  // Index preferring adds a slight advantage
  exploreBiNeighborsMatrix(maxDimensions) {
    const exploredSome = this.checkBiNeighborsMatrix()
    if (!exploredSome && (this.dimension < maxDimensions)) {
      this.extendDimension()
      return this.checkBiNeighborsMatrix()
    }
    return exploredSome
  },

  exploreBiNeighbors(maxDimensions) {
    const minBiNeighbors = this.checkBiNeighbors()
    if (!minBiNeighbors.length && (this.dimension < maxDimensions)) {
      this.extendDimension()
      return this.checkBiNeighbors()
    }
    return minBiNeighbors
  },

  async exploreLocalMinimum ({timeBudget, trialBudget, maxDimensions}) {
    const timePlaned = timeBudget * 1000
    const startAt = +new Date()
    let count = 0
    while (count < trialBudget) {
      const timeUsed= new Date() - startAt
      if (timeUsed > timePlaned) break
      if (this.gotPerfectSolution()) break
      if (isCloseToPeriod(timeUsed, 100)) await sleep(0)
      if (!this.exploreBiNeighborsMatrix(maxDimensions)) break
      count ++
    }
    const totalTimeUsed = new Date() - startAt
    this.lastSearchTimeUsed = totalTimeUsed || this.lastSearchTimeUsed
  },

  async findThePoint ({
    timeBudget = Infinity,
    trialBudget = Infinity,
    maxDimensions = Infinity
  } = {}) {
    if (timeBudget === Infinity &&
      trialBudget === Infinity
    ) timeBudget = SpaceConst.TIME_BUDGET_DEFAULT
    await this.exploreLocalMinimum({timeBudget, trialBudget, maxDimensions})
    return this.minDistancePoint
  }
}
