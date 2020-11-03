module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
  ],
  collectCoverageFrom: [
    'src/app/js/**/*.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests.js'],
  coverageDirectory: '<rootDir>/build/reports/coverage',
  coverageThreshold: {
    global: {
      branches: 92,
      functions: 97,
      lines: 98,
      statements: 98,
    }
  },
  coverageReporters: ['lcov', 'html'],
  testResultsProcessor: 'jest-sonar-reporter',
  timers: 'fake',
  testURL: 'http://localhost:8080',
}
