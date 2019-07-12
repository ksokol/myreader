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
    'jest',
    'react-hooks'
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
    'react/display-name': 'warn',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/catch-error-name': 'warn',
    'unicorn/filename-case': 'off',
    'unicorn/prefer-query-selector': 'warn',
    'unicorn/import-index': 'warn',
    'unicorn/prefer-includes': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  }
}
