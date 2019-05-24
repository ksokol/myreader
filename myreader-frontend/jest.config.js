module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/__mocks__/styleMock.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
  ],
  collectCoverageFrom: [
    'src/app/js/**/*.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests.js'],
  coverageDirectory: '<rootDir>/build/reports/coverage',
  testResultsProcessor: 'jest-sonar-reporter',
  timers: 'fake',
  testURL: 'http://localhost:8080'
}
