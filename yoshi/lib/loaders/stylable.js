'use strict';

const stylableRegExp = /\.st\.css$/;
const stylableOptions = { injectBundleCss: true, filename: '[name].stylable.bundle.css' };
module.exports = (options = stylableOptions) => ({
  test: stylableRegExp,
  options,
  loader: 'stylable-integration/webpack-loader'
});

module.exports.stylableOptions = stylableOptions;
module.exports.stylableRegExp = stylableRegExp;