const bash = require('util').promisify(require('child_process').exec);

const getPackages = async() => {
  const {stdout: packages} = await bash('ls src');
  return packages.split('\n').map(x => x.trim()).filter(x => /^ganic/.test(x));
}

module.exports = {
  bash,
  getPackages,
}
