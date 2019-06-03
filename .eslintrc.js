module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'standard',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    'no-path-concat': 0,
    'semi': 0,
    'quotes': 0,
    'camelcase': 0,
    'keyword-spacing': 0,
    'new-parens': 0,
    'eol-last': 0,
    'no-tabs': 0,
    'indent': 0,
    'no-unreachable': 0,
    'space-before-function-paren': 0,
  }
}
