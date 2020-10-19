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
  dView.afterUpdateTable = async dv => {
    const {inputs, expectations} = dv.getInputsExpectations()
    const space = new Space(polyNumbersTranslation)
    const origin = [0] || parsePolyNumbersFormula(startFormula)
    space.take(inputs, expectations).setup(origin)
    const update = point => {
      const nomials = point.getNomials()
      dv.updateLatex(polyNumbersFormatter(nomials, false))
      dv.updateNomials(nomials)
    }

    space.onProgress = update

    const minDistancePoint = await space.findThePoint({
      timeBudget: 1000,
      trialBudget: 100 * 1000,
      maxDimensions: 10
    })

    update(minDistancePoint)
  }
})()
