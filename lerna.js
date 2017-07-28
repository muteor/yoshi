const lernaScript = require('lerna-script');

module.exports.pullRequest = () => {
  const execCommand = lernaScript.exec.command(lernaScript.rootPackage());	
  setInterval(() => console.log('.'), 1000 * 60 * 5).unref();

  return execCommand('npm run bootstrap')
  	.then(() => execCommand('npm run test'));
};