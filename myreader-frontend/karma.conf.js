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
            'src/tests.webpack.js',
            'test/*.js'
        ],
        preprocessors: {
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },
        browsers: [
            'ChromeHeadless'
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
