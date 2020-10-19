class DesmosView {
  constructor (elt) {
    this.elt = elt
    this.calculator = Desmos.GraphingCalculator(elt)

    this.latex = 'f(x)=0'
    this.xValues = []
    this.yValues = []

    this.init()
  }

  getInputsExpectations () {
    return {
      inputs: this.xValues.map(x => +x),
      expectations: this.yValues.map(y => +y)
    }
  }

  init () {
    this.bindEvents()
  }

  async bindEvents () {
    this.elt.addEventListener('touchend', e => this.onClick(e))
    this.elt.addEventListener('click', e => this.onClick(e))
  }

  onClick (evt) {
    if (!/dcg-graph-outer/.test(evt.target.className)) return
    evt = (evt.touches && evt.touches[0]) || (evt.changedTouches && evt.changedTouches[0]) || evt

    const rect = this.elt.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    const mathCoordinates = this.calculator.pixelsToMath({x: x, y: y})

    if (!this.inRectangle(
      mathCoordinates,
      this.calculator.graphpaperBounds.mathCoordinates
    )) return

    this.xValues.push(mathCoordinates.x.toPrecision(2))
    this.yValues.push(mathCoordinates.y.toPrecision(2))
    this.updateTable()
  }

  updateLatex (latex) {
    this.latex = latex
    this.updateGraph()
  }

  updateGraph () {
    this.calculator.setExpression({
      id: 'graph1',
      latex: this.latex
    })
  }

  updateTable () {
    this.calculator.setExpression({
      id: 'table1',
      type: 'table',
      columns: [
        {latex: 'x', values: this.xValues},
        {latex: 'y', values: this.yValues}
      ]
    })
    this.afterUpdateTable && this.afterUpdateTable(this)
  }

  updateNomials (nomials) {
    this.calculator.setExpression({
      id: 'table-nomial',
      type: 'table',
      columns: [
        {latex: 'n', values: Object.keys(nomials).map(k => +k), hidden: true},
        {latex: 'a_n', values: nomials, hidden: true}
      ],
      points: false
    })
  }

  inRectangle (point, rect) {
    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y <= rect.top &&
      point.y >= rect.bottom
    )
  }
}

module.exports = {
  DesmosView
}
