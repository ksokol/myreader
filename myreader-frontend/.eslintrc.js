module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: '16',
    }
  },
  plugins: [
    'jest'
  ],
  rules: {
    indent: [
      'warn',
      2
    ],
    'linebreak-style': [
      'warn',
      'unix'
    ],
    quotes: [
      'warn',
      'single'
    ],
    semi: [
      'warn',
      'never'
    ],
    'no-undef': 'warn',
    'no-unused-vars': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'warn',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'react/display-name': 'never',
    'unicorn/prevent-abbreviations': 'never',
    'unicorn/catch-error-name': 'warn',
    'unicorn/filename-case': 'warn',
    'unicorn/prefer-query-selector': 'warn',
    'unicorn/import-index': 'warn',
    'unicorn/prefer-includes': 'warn'
  }
}
