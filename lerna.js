const {loadRootPackage, loadPackages, exec, iter, filters, changes} = require('lerna-script');

module.exports.idea = require('lerna-script-preset-idea');

module.exports.test = () => {
  const packages = filters.removeBuilt(loadPackages())('test');

  return iter.forEach(packages)(pkg => {
  	return exec.script(pkg)('build')
  	  .then(() => exec.script(pkg, {silent: false})('test'))
  	  .then(() => changes.build(pkg)('test'));
  });
};

module.exports.clean = () => {
  return iter.parallel(loadPackages())(pkg => {
    const runCommand = exec.command(pkg);
  	return Promise.all(['rm -f yarn.lock', 'touch yarn.lock', 'rm -rf node_modules', 'rm -f *.log'].map(runCommand));
  });
};
