'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Reference: http://webpack.github.io/docs/configuration.html
     */
    var config = {};

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = isTest ? void 0 : {
        app: './src/app/js/main.js',
        vendors: [
            'angular',
            'angular-sanitize',
            'angular-messages',
            'angular-ui-router',
            'ui-router-extras',
            'angular-material',
            'angular-local-storage',
            'angular-cache',
            'angular-hotkeys',
            'moment'
         ]
    };

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    config.output = isTest ? {} : {
        // Absolute output directory
        path: __dirname + '/dist',

        // Output path from the view of the page
        // Uses webpack-dev-server in development
        publicPath: isProd ? '' : 'http://localhost:8080/',

        // Filename for entry points
        // Only adds hash in build mode
        filename: isProd ? 'app/[name].[hash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? 'app/[name].[hash].js' : '[name].bundle.js'
    };

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map';
    }

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [{
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Reference: https://github.com/webpack/style-loader
            test: /\.css$/,
            use: isTest ? 'null-loader' : ExtractTextPlugin.extract({
                fallback: 'style-loader',
                loader: 'css-loader'
            })
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            query: {
                publicPath: '../',
                outputPath: 'app/',
            },
            loader: 'file-loader'
        }, {
            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            test: /\.html$/,
            exclude: /node_modules/,
            use: 'raw-loader'
        }]
    };

    // ISTANBUL LOADER
    // https://github.com/deepsweet/istanbul-instrumenter-loader
    if (isTest) {
        config.module.rules.push({
            enforce: 'pre',
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.spec\.js$/
            ],
            loader: 'istanbul-instrumenter-loader',
            query: {
                esModules: true
            }
        })
    }

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        new webpack.IgnorePlugin(/^\.\/lang$/, /moment$/)
    ];

    // Skip rendering index.html in test mode
    if (!isTest) {
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                minify: {
                    collapseWhitespace: true
                }
            }),

            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin({filename: 'app/[name].[hash].css', disable: !isProd, allChunks: true}),

            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module, count) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        (/\.js$/.test(module.resource) || /\.css$/.test(module.resource)) &&
                        module.resource.indexOf(path.join(__dirname, 'node_modules')) === 0
                    )
                }
            }),

            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                canPrint: true
            })
        )
    }

    if (isProd) {
        config.plugins.push(

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            new webpack.optimize.UglifyJsPlugin(),

            new FaviconsWebpackPlugin({
                logo: './src/app/img/favicon.png',
                // The prefix for all image files (might be a folder or a name)
                prefix: 'app/icons-[hash]/',
                // Emit all stats of the generated icons
                emitStats: false,
                // The name of the json containing all favicon information
                statsFilename: 'iconstats-[hash].json',
                // Generate a cache file with control hashes and
                // don't rebuild the favicons until those hashes change
                persistentCache: true,
                // Inject the html into the html-webpack-plugin
                inject: true,
                // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
                background: '#fff',
                // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
                title: 'MyReader',

                // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    opengraph: false,
                    twitter: false,
                    yandex: false,
                    windows: false
                }
            })
        )
    }

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './src',
        stats: 'minimal',
        proxy: {
            "/myreader/api": {
                target: "http://localhost:19340",
                secure: false
            },
            "/check": {
                target: "http://localhost:19340/myreader",
                secure: false
            },
            "/logout": {
                target: "http://localhost:19340/myreader",
                secure: false
            },
            "/myreader/info": {
                target: "http://localhost:19340",
                secure: false
            }
        }
    };

    return config;
}();