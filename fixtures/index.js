import 'regenerator-runtime/runtime'
import Space from '../src/Space'
import {
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula
} from '../src/utils'
import { DesmosView } from './desmos'

;(async() => {
  const dView = new DesmosView(document.getElementById('desmos-calculator'))
  let space

  dView.afterUpdateTable = async dv => {
    space && space.destroy()

    const {inputs, expectations} = dv.getInputsExpectations()
    space = new Space(polyNumbersTranslation)
    const origin = [0] || parsePolyNumbersFormula(startFormula)
    space.take(inputs, expectations).setup(origin)
    const update = point => {
      const nomials = point.getNomials()
      dv.updateLatex(polyNumbersFormatter(nomials, false))
      dv.updateNomials(nomials)
    }
    space.onProgress = update

    const minDistancePoint = await space.findThePoint({
      timeBudget: 10 * 60,
      trialBudget: 10 * 1000 * 1000,
      maxDimensions: 100
    })

    update(minDistancePoint)
  }
})()
