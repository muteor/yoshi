const lernaScript = require('lerna-script');

module.exports.test = () => {
  setInterval(() => console.log('.'), 1000 * 60 * 5).unref();
  const execCommand = lernaScript.exec.command(lernaScript.rootPackage());

  return execCommand('npm run test');
};