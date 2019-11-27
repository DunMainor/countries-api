module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "no-undef": "warn",
    "promise/always-return": "warn",
    "promise/no-nesting": "warn",
    "camelcase":"off",
    "prefer-promise-reject-errors":"off",
    "promise/always-return":"off"
  }
}
