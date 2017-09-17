'use strict';
const StylablePlugin = require('stylable-integration/webpack-plugin');

const stylableRegExp = /\.st\.css$/;
const stylableOptions = { injectBundleCss: true, filename: '[name].stylable.bundle.css', nsDelimiter: '--' };

module.exports = (options = stylableOptions) => StylablePlugin.rule();

module.exports.stylableOptions = stylableOptions;
module.exports.stylableRegExp = stylableRegExp;