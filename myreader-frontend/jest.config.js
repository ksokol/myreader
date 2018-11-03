module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/node_modules/jest-css-modules-transform',
    '^.+\\.html$': 'html-loader-jest'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  collectCoverageFrom: [
    'src/app/js/**/*.js'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/src/tests.js',
  coverageDirectory: '<rootDir>/build/reports/coverage',
  testResultsProcessor: 'jest-sonar-reporter',
  /*
   * TODO Comes into effect as soon as patched setTimeout function in app.module.js has been removed.
   */
  timers: 'fake',
  testURL: 'http://localhost:8080',
}
