const js = require('@eslint/js');
const pluginVue = require('eslint-plugin-vue');

module.exports = [
  js.configs.recommended,
  ...pluginVue.configs['flat/vue3-essential'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly'
      }
    },
    rules: {}
  },
  {
    ignores: ['node_modules/', 'dist/']
  }
];
