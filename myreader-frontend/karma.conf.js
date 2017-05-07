module.exports = function karmaConfig (config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        reporters: [
            'progress',
            'coverage'
        ],
        files: [
            'src/tests.webpack.js',
            'test/*.js'
        ],
        preprocessors: {
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },
        browsers: [
            'PhantomJS'
        ],
        singleRun: true,
        coverageReporter: {
            type: 'lcov',
            dir : 'build/reports/istanbul/'
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
