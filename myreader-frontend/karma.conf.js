module.exports = function karmaConfig (config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        reporters: [
            'progress',
            'sonarqubeUnit',
            'coverage-istanbul'
        ],
        files: [
            'src/tests.js'
        ],
        preprocessors: {
            'src/tests.js': ['webpack', 'sourcemap']
        },
        browsers: [
            'FirefoxHeadless'
        ],
        singleRun: true,
        coverageIstanbulReporter: {
            type: 'lcov',
            dir : 'build/reports/istanbul/'
        },
        sonarQubeUnitReporter: {
            sonarQubeVersion: 'LATEST',
            outputFile: 'build/TESTS.xml',
            useBrowserName: false
        },
        webpack: require('./webpack.config'),
        webpackMiddleware: {
            noInfo: 'errors-only'
        },
        logLevel: config.LOG_INFO,
        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true
        }
    });
};
