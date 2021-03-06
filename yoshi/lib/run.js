'use strict';

const {watchMode, logIfAny, inTeamCity} = require('./utils');
const {log, logIf, logIfP} = require('./log');
const {base, statics} = require('./globs');
const projectConfig = require('../config/project');
const {spawnSync} = require('child_process');
const {tryRequire} = require('./utils');
const path = require('path');

const watch = watchMode();

function pluginInstall(modules) {
  return new Promise((resolve, reject) => {
    const child = spawnSync('npm', ['install', '--prefix', 'node_modules/yoshi/plugins'].concat(modules), {shell: true});

    child.status === 0 ?
      resolve() :
      reject(child.stderr.toString());
  });
}

function pluginRequire(module) {
  const plugin = path.resolve(process.cwd(), `./node_modules/yoshi/plugins/node_modules/${module}`);
  return tryRequire(module) || tryRequire(plugin);
}

module.exports = (plugins, options) => {
  const modules = plugins.reduce((all, next) => all.concat(next), []).filter(x => !pluginRequire(x));

  const install = modules.length > 0 ?
    log(pluginInstall)(modules) :
    Promise.resolve();

  const result = plugins.reduce((promise, parallel) => {
    return promise.then(() => {
      return Promise.all(parallel.map(task => {
        return pluginRequire(task)({log, logIf, logIfP, watch, base, statics, inTeamCity, projectConfig})(options);
      }));
    });
  }, install);

  return result
    .catch(error => {
      logIfAny(error);
      if (!watch) {
        process.exit(1);
      }
    });
};
