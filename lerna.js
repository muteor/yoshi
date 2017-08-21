const {loadRootPackage, loadPackages, exec, iter, filters, changes} = require('lerna-script');

module.exports.idea = require('lerna-script-preset-idea');

module.exports.test = () => {
  //hack for travis timing out in 10 minutes due to inactivity, when in reality yoshi tests take looong time...;
  setInterval(() => process.stdout.write('.'), 1000 * 60 * 5).unref();

  const packages = filters.removeBuilt(loadPackages())('test');

  return iter.forEach(packages)(pkg => {
    return exec.script(pkg)('build')
      .then(() => exec.script(pkg, {silent: false})('test'))
      .then(() => changes.build(pkg)('test'));
  });
};

module.exports.clean = () => {
  const clearInRoot = Promise.all(['rm -f yarn.lock', 'touch yarn.lock', 'rm -f *.log', 'rm -rf .lerna']
    .map(exec.command(loadRootPackage())));
  const clearInModules = iter.parallel(loadPackages())(pkg => {
    const runCommand = exec.command(pkg);
    return Promise.all(['rm -f yarn.lock', 'touch yarn.lock', 'rm -rf node_modules', 'rm -f *.log'].map(runCommand));
  });

  return Promise.all([clearInRoot, clearInModules]);
};
