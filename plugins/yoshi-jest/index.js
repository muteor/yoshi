'use strict';

const merge = require('lodash.merge');
const jestCli = require('jest-cli');

module.exports = ({log, watch, inTeamCity, projectConfig}) => {
  function jest() {
    const config = merge(projectConfig.jestConfig(), {
      transform: {
        '\\.js$': require.resolve('./transformer')
      }
    });

    if (inTeamCity()) {
      config.testResultsProcessor = require.resolve('jest-teamcity-reporter');
    }

    return new Promise((resolve, reject) => {
      jestCli.runCLI({watch, config}, [process.cwd()], result => {
        result.success ? resolve() : reject('jest failed');
      });
    });
  }

  return log(jest);
};
