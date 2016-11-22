'use strict';

const path = require('path');
const _ = require('lodash');
const packagejson = require(path.resolve('package.json'));
const globs = require('../lib/globs');

const config = packagejson.wix || {};
const externalUnprocessedModules = [
  'wix-style-react/src'
];
const allSourcesButExternalModules = /^(?!.*?node_modules).*$/;

module.exports = {
  specs: {
    node: () => getConfig('specs.node'),
    browser: () => getConfig('specs.browser')
  },
  clientProjectName: () => getConfig('clientProjectName'),
  clientFilesPath: () => {
    const clientProjectName = getConfig('clientProjectName');
    const dir = getConfig('servers.cdn.dir');
    return clientProjectName ?
      `node_modules/${clientProjectName}/${dir || globs.multipleModules.clientDist()}` :
      (dir || globs.singleModule.clientDist());
  },
  isUniversalProject: () => getConfig('universalProject'),
  isAngularProject: () => !!_.get(packagejson, 'dependencies.angular', false),
  servers: {
    cdn: {
      port: () => getConfig('servers.cdn.port', 3200)
    }
  },
  entry: () => getConfig('entry'),
  defaultEntry: () => './client',
  separateCss: () => getConfig('separateCss', true),
  cssModules: () => getConfig('cssModules', true),
  externals: () => getConfig('externals'),
  babel: () => _.get(packagejson, 'babel'),
  noServerTranspile: () => getConfig('noServerTranspile'),
  unprocessedModules: () => externalUnprocessedModules
    .map(m => new RegExp(`node_modules/${m}`))
    .concat(allSourcesButExternalModules),
  jestConfig: () => _.get(packagejson, 'jest', {})
};

function getConfig(key, defaultVal = false) {
  return _.get(config, key, defaultVal);
}
