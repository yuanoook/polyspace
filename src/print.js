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
  printFunc,
  getPrintFunc
}