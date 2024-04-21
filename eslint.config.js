/* eslint-disable import/no-extraneous-dependencies */

const globals = require('globals');
const { FlatCompat } = require('@eslint/eslintrc');
const pluginJs = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname, // using __dirname from CommonJS
  recommendedConfig: pluginJs.configs.recommended,
});

module.exports = [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  ...compat.extends('airbnb'),
];
