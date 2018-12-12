module.exports = {
  'parserOptions': {
    'ecmaVersion': 8,
    'sourceType': 'module',
    'ecmaFeatures': {
      'impliedStrict': true,
    },
  },

  'rules': {
    'requirejs/no-invalid-define': 2,
    'requirejs/no-multiple-define': 2,
    'requirejs/no-named-define': 2,
    'requirejs/no-commonjs-wrapper': 2,
    'requirejs/no-object-define': 1,
    "backbone/collection-model": 1,
    "backbone/defaults-on-top": 1,
    "backbone/model-defaults": 1,
    "backbone/no-constructor": 1,
    "backbone/no-native-jquery": 1
  },
  'plugins': [
    'requirejs',
    "backbone"
  ],
  'env': {
    'es6': true,
    'commonjs': true,
    'amd': true,
    'jquery': true,
    'mongo': true,
    'browser': true,
    'node': true,
  },
  'extends': [
    'standard',
    "plugin:backbone/recommended"
  ]
}