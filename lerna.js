const {rootPackage, exec} = require('lerna-script');

module.exports.test = () => {
  setInterval(() => console.log('.'), 1000 * 60 * 5).unref();

  return exec.command(rootPackage())('lerna run build && lerna --concurrency=1 run test');
};

module.exports.clean = () => {
  setInterval(() => console.log('.'), 1000 * 60 * 5).unref();
  const runCommand = exec.command(rootPackage());

  return runCommand('lerna clean --yes')
    .then(() => runCommand('lerna exec -- rm -f yarn.lock && lerna exec -- touch yarn.lock'));
};
