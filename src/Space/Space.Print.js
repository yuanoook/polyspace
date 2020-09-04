const {
  randomSubList
} = require('../utils')
const SpaceConst = require('./Space.Const')

module.exports = {
  printMinNeighbors () {
    const minNeighborsNomials = this.minDistancePoint.printNeighbors(false)
    return JSON.stringify(minNeighborsNomials, null, 2)
  },

  regularSample (log, amount = 100) {
    const logLength = log.length
    const samplingPeriod = Math.floor(logLength / amount)
    return log
      .filter((_, index) => !(index % samplingPeriod))
      .map(point => point.extendDimension(this.dimension))
  },

  randomSample (log, amount = 100) {
    return randomSubList(log, amount)
      .map(point => point.extendDimension(this.dimension))
  },

  sampleLog (log, amount) {
    return this.regularSample(log, amount)
  },

  printPointsLog (log, amount) {
    return this.sampleLog(log, amount)
      .map(point => [...point.getNomials(), point.distance].join('\t'))
      .join('\n')
  },

  printVisitedPoints (logSampleAmount) {
    return this.printPointsLog(this.visitedPoints, logSampleAmount)
  },

  printCheckedPoints (logSampleAmount) {
    return this.printPointsLog(this.checkedPoints, logSampleAmount)
  },

  async printSolution ({
    precision = SpaceConst.PRECISION,
    solutionFormatter = x => x,
    showMinNeighbors = false,
    showVisitedPoints = false,
    showCheckedPoints = false,
    logSampleAmount = 100,
    printFunc = console.log.bind(console)
  } = {}) {
    const thePoint = this.minDistancePoint
    const solutionNomials = thePoint.getTrimmedNomials(precision)
    const solution = solutionFormatter(solutionNomials)
    const successTrialRate = (100 * this.stepCount / this.checkCount).toFixed(2)
    const timeStepSpeed = (this.stepCount / this.lastSearchTimeUsed).toFixed(4)

    await printFunc(`Find${
      this.gotPerfectSolution() ? ' perfect' : '' } curve fitting: ${
      solution} \n  in ${
      this.lastSearchTimeUsed } ms in ${
      this.stepCount } steps \n  with speed ${
      timeStepSpeed} steps/ms \n  tried ${
      this.checkCount } times in ${
      this.dimension } dimensions \n  with success trial rate ${
      successTrialRate}% \n  got min distance ${
      this.minDistance } \n \nVisualize it - https://chart-studio.plotly.com/create/ ${
      showMinNeighbors ? this.printMinNeighbors() : ''} \n${
      showVisitedPoints
        ? '\nVisited Points: \n' + this.printVisitedPoints(logSampleAmount)
        : ''} \n${
      showCheckedPoints
        ? '\nChecked Points: \n' + this.printCheckedPoints(logSampleAmount)
        : ''
      }`)
  }

}
