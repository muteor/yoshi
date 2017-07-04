const _ = require('lodash');
const {runIndividualTranspiler} = require('../config/project');
const {isTypescriptProject, isBabelProject} = require('./utils');

const linter = isTypescriptProject() ? 'yoshi-tslint' : 'yoshi-eslint';

function transpiler() {
  if (isTypescriptProject() && runIndividualTranspiler()) {
    return 'yoshi-typescript';
  }

  if (isBabelProject() && runIndividualTranspiler()) {
    return 'yoshi-babel';
  }

  return './tasks/no-transpile';
}

function tests(options) {
  const commands = {
    mocha: './tasks/mocha',
    jasmine: './tasks/jasmine',
    protractor: './tasks/protractor',
    karma: './tasks/karma',
    jest: 'yoshi-jest'
  };

  const option = _.find(commands, (value, key) => options[key]);

  return option ? [[option]] : [[commands.mocha], [commands.protractor]];
}

module.exports = options => ({
  build: [
    ['yoshi-clean', 'yoshi-update-node-version'],
    ['yoshi-sass', './tasks/less', 'yoshi-petri', 'yoshi-maven-statics', 'yoshi-copy', transpiler(), './tasks/bundle'],
    ['yoshi-fedops-build-report']
  ],
  lint: [[linter, 'yoshi-stylelint']],
  release: [['yoshi-wnpm-release']],
  start: [
    ['yoshi-clean', 'yoshi-update-node-version'],
    ['yoshi-sass', './tasks/less', 'yoshi-petri', 'yoshi-maven-statics', 'yoshi-copy', transpiler(), './tasks/webpack-dev-server']
  ],
  test: tests(options)
});
