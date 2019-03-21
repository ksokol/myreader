module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/node_modules/jest-css-modules-transform'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  collectCoverageFrom: [
    'src/app/js/**/*.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests.js'],
  coverageDirectory: '<rootDir>/build/reports/coverage',
  testResultsProcessor: 'jest-sonar-reporter',
  timers: 'fake',
  testURL: 'http://localhost:8080',
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/src/app/js/migrations/react-router-dom'
  }
}
