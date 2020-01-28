module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-param-reassign': 'off',
    'class-methods-use-ths': 'off',
    'camelcase': 'off',
    'no-unused-vars': ['error', {
      'argsIgnorePattern': 'next'
    }],
  },
};
