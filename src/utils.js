const PRECISION = 6

function randomDistanceRatio (flag = 0) {
  let ratio
  while (!ratio || ratio === -1) ratio = Math.random() * 2 - 1
  if (!flag) return ratio
  if (flag < 0) return -Math.abs(ratio)
  if (flag > 0) return Math.abs(ratio)
}

function randomPositiveDistanceRatio () {
  return randomDistanceRatio(1)
}

function randomNaturalNumber (upperLimit = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * upperLimit)
}

function randomSafeNumber (limit = Number.MAX_SAFE_INTEGER) {
  validatePositive(limit)
  return randomDistanceRatio() * limit
}

function randomPositiveSafeNumber (limit = Number.MAX_SAFE_INTEGER) {
  validatePositive(limit)
  return randomPositiveDistanceRatio() * limit
}

function validatePositive (value) {
  if (value <= 0) throw new Error(`Must be positive - ${value}`)
}

function validateLimits (value, left, right) {
  if (value < left || value > right) throw new Error(`${left} <= ${value} <= ${right}`)
  return true
}

function validateDistanceRatio (distanceRatio, flag = 0) {
  if (distanceRatio === 0 ||
    distanceRatio <= -1 ||
    distanceRatio >= 1
  ) throw new Error(`-1 < DistanceRatio(!==0) < 1. We get ${distanceRatio}`)

  if (!flag) return
  if (flag < 0 && distanceRatio > 0)
    throw new Error(`DistanceRatio < 0. We get ${distanceRatio}`)
  if (flag > 0 && distanceRatio < 0)
    throw new Error(`DistanceRatio > 0. We get ${distanceRatio}`)
}

function repeat (call, count = 1) {
  const results = []
  while (count > 0) {
    results.push(call(results.length))
    count --
  }
  return results
}

// TODO: add test
function call2Nomials (n1, n2, call) {
  return repeat(i => {
    const n1i = n1[i] === undefined ? 0 : n1[i]
    const n2i = n2[i] === undefined ? 0 : n2[i]
    return call(n1i, n2i)
  }, Math.max(n1.length, n2.length))
}

function add2Nomials (n1, n2) {
  return call2Nomials(n1, n2, (n1i, n2i) => {
    return n2i + n1i
  })
}

function diffNomials (n1, n2) {
  return call2Nomials(n1, n2, (n1i, n2i) => n2i - n1i)
}

function isSameNomials (n1, n2) {
  return euclideanDistance (n1, n2) === 0
}

function euclideanDistance (n1, n2) {
  let sum = 0
  repeat(i => {
    const n1i = n1[i] === undefined ? 0 : n1[i]
    const n2i = n2[i] === undefined ? 0 : n2[i]
    return sum += (n2i - n1i) ** 2
  }, Math.max(n1.length, n2.length))
  return Math.sqrt(sum)
}

// TODO: add test

// This is from facebook/jest - toBeCloseTo
// https://github.com/facebook/jest/blob/2a92e7f49fa35b219e5099d56b0179bccc1bf53e/packages/expect/src/matchers.ts#L125
function isCloseTo (received, expected, precision = PRECISION) {
  let expectedDiff = 0
  let receivedDiff = 0
  if (received === Infinity && expected === Infinity) return true
  if (received === -Infinity && expected === -Infinity) return true

  expectedDiff = Math.pow(10, -precision) / 2
  receivedDiff = Math.abs(expected - received)
  return receivedDiff < expectedDiff
}

// TODO: add test
function isCloseToPeriod (number, period, {precision = PRECISION, includeZero = false} = {}) {
  return isCloseTo(number % period, includeZero ? 0 : period, precision)
}

// TODO: this should be moved out from the file
// This is just a very basic example of translation function
// 
// A translation takes a point, and outputs a system
// eg. f(x) = a0 + a1x
//
// A system takes inputs, and gives out outputs
// This is an example of translation
// which the system is
//   f(x) = a0 + a1 * x + a2 * x^2 ...
//
// For more information about poly numbers,
// please follow the video by Norman J. Wildberger
// https://www.youtube.com/watch?v=-Ad6pYjCAmg

function calculatePolyNumbers (coefficients, variable) {
  return coefficients.reduce((sum, coefficient, exponent) =>
    sum + coefficient * (variable ** exponent), 0
  )
}

function polyNumbersTranslation (nomials) {
  return input => calculatePolyNumbers(nomials, input)
}

const Superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹',]
Superscripts['.'] = '⋅'
Object.assign(Superscripts, {
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  'n': 'ⁿ',
  'i': 'ⁱ'
})
SuperscriptsReverseMap = {}
Object.keys(Superscripts).forEach(key => SuperscriptsReverseMap[Superscripts[key]] = key)

function toSuperscripts (number) {
  return (number + '').split('').map(n => Superscripts[n] || n)
}
function polyNumberFormatter (nomial, index) {
  return nomial ? `${
    (nomial === 1 && index)
      ? ''
      : (nomial === -1 ? '-' : nomial)
  }${
    index ? `x${
      index !== 1 ? toSuperscripts(index) : ''
    }` : ''
  }` : ''
}
function polyNumbersFormatter (nomials) {
  return `f(x) = ${
    nomials
      .map(polyNumberFormatter)
      .filter(s => s)
      .join(' + ')
      .replace(/\+\s\-/g, '- ')
  }`
}
function parseSuperscript (script) {
  if (script === undefined) return 0
  if (script === '') return 1
  return +script.split('')
    .map(n => SuperscriptsReverseMap[n] || n)
    .join('')
}
function parseCoefficient (number, exponent) {
  number = (number+'').replace(/\s/g, '')
  number = number === '-' ? '-1' : number
  return +number || (exponent ? 1 : 0)
}
function parsePolyNumbersFormulaItem (item) {
  let [number, superscript] = item.trim().split('x')
  const exponent = parseSuperscript(superscript)
  const coefficient = parseCoefficient(number, exponent)
  return [exponent, coefficient]
}
function parsePolyNumbersFormula (formula) {
  const nomials = []
  formula.replace(/^f\(x\) = /, '')
    .replace(/e\s*-/g, '*[ee]*')  // Fix science notation
    .replace(/-/g, '+-')
    .replace(/\*\[ee\]\*/g, 'e-') // Restore science notation
    .split('+')
    .map(parsePolyNumbersFormulaItem)
    .forEach(([exponent, coefficient]) => {
      nomials[exponent] = coefficient
    })
  return repeat(index => nomials[index] || 0, nomials.length)
}

// TODO: add test
function trimNomials (nomials, precision = PRECISION) {
  let nonZeroStarted = false
  return [...nomials].reverse().reduce((result, nomial, index) => {
    nonZeroStarted = nonZeroStarted || (precision
      ? !isCloseTo(nomial, 0, precision)
      : (nomial !== 0))
    return nonZeroStarted
      ? result.concat(precision ? +nomial.toFixed(precision) : nomial)
      : result
  }, []).reverse()
}

// TODO: add test
function last (array) {
  return array[array.length - 1]
}

// TODO: add test
async function sleep (second = 1) {
  return Promise(resolve => setTimeout(resolve, second * 1000))
}

// TODO: test this amazing beautiful code
// I have no idea what's this, but this works very fast
// https://stackoverflow.com/a/25984542/6767484
const randomShuffle = list => (((a,b,c,d) => {
  c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
})(list),list)
const randomSubList = (list, count) => randomShuffle([...list]).slice(0, count)

// TODO: add test
const genFileTimePostfix = () => new Date()
  .toString()
  .replace(/\:/g,'-')
  .replace(/[^\d\w\-]/g, ' ')
  .trim()
  .replace(/\s/g, '_')
  .split('__')[0]

const unlinkFiles = regex => {
  const fs = require('fs')
  const dir = './'
  fs.readdirSync(dir)
    .filter(f => regex.test(f))
    .map(f => fs.unlinkSync(dir + f))
}

const printFunc = (text, name = '') => {
  unlinkFiles(new RegExp(`^log-${name}`))
  require('fs').writeFileSync(`./log-${name}-${genFileTimePostfix()}.txt`, text)
}

const getPrintFunc = name => text => printFunc(text, name)

module.exports = {
  randomDistanceRatio,
  randomPositiveDistanceRatio,
  validateDistanceRatio,
  randomNaturalNumber,
  randomSafeNumber,
  randomPositiveSafeNumber,
  validatePositive,
  validateLimits,
  repeat,
  add2Nomials,
  diffNomials,
  isSameNomials,
  trimNomials,
  euclideanDistance,
  isCloseTo,
  isCloseToPeriod,
  calculatePolyNumbers,
  polyNumbersTranslation,
  polyNumbersFormatter,
  parsePolyNumbersFormula,
  last,
  sleep,
  randomShuffle,
  randomSubList,
  genFileTimePostfix,
  printFunc,
  getPrintFunc
}
