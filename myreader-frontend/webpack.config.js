'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
require('babel-plugin-angularjs-annotate')

const ENV = process.env.npm_lifecycle_event
const isTest = ENV === 'test' || ENV === 'test-watch'
const isReport = ENV === 'report'
const isProd = ENV === 'build' || isReport
const isServed = ENV === 'server'

const environment = isTest ? 'test' : isServed ? 'development' : 'production'

const BACKEND_PORT = 19340
const BACKEND_CONTEXT = 'myreader'

module.exports = function makeWebpackConfig() {
    /**
     * Reference: http://webpack.github.io/docs/configuration.html
     */
    const config = {}

    config.stats = 'verbose'

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    config.entry = isTest ? void 0 : {
        vendor: './src/app/js/vendor.js',
        app: './src/app/js/main.js'
    }

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
        filename: isProd ? 'app/[name].[chunkhash].js' : '[name].bundle.js',

        // Filename for non-entry points
        // Only adds hash in build mode
        chunkFilename: isProd ? 'app/[name].[chunkhash].js' : '[name].bundle.js'
    }

    /**
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map'
    }

    config.resolve = {
        alias: {
            store: path.resolve(__dirname, 'src/app/js/store')
        }
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
                use: 'css-loader'
            })
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/,
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
        }, {
            test: /\.svg$/,
            loader: 'svg-url-loader',
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['env'],
                plugins: ['transform-object-rest-spread', ['angularjs-annotate', { 'explicitOnly' : true}]]
            }
        }]
    }

    // ISTANBUL LOADER
    // https://github.com/deepsweet/istanbul-instrumenter-loader
    if (isTest) {
        config.module.rules.push({
            enforce: 'post',
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.spec\.js$/,
                /test-utils.js$/
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
        new BundleAnalyzerPlugin({analyzerMode: isReport ? 'server' : 'disabled'}),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(environment)
        })
    ]

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
            new ExtractTextPlugin({filename: 'app/[name].[contenthash].css', disable: !isProd, allChunks: true}),

            // https://angular.io/guide/webpack#inside-webpackcommonjs
            // Define entry points in hierarchical order. Webpack removes dependencies from 'app' chunk which
            // are part of 'vendor' chunk
            new webpack.optimize.CommonsChunkPlugin({
                name: ['app', 'vendor']
            }),

            // https://webpack.js.org/plugins/commons-chunk-plugin/#manifest-file
            // Extract Webpack bootstrap logic into manifest.js otherwise it gets written into vendor.js
            new webpack.optimize.CommonsChunkPlugin({
                name: "manifest",
                minChunks: Infinity
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

    config.devServer = {
        contentBase: './src',
        stats: 'minimal',
        proxy: [{
            context: ['/myreader/api', '/myreader/info', '/api', '/check', '/logout', '/info'], // deprecated: '/myreader/api', '/myreader/info'
            target: `http://localhost:${BACKEND_PORT}`,
            pathRewrite: path => path.startsWith(`/${BACKEND_CONTEXT}`) ? path : `/${BACKEND_CONTEXT}/${path}`,
            onProxyRes: proxyRes => {
                const setCookies = proxyRes.headers['set-cookie']
                if (setCookies) {
                    proxyRes.headers['set-cookie'] = setCookies.map(setCookie => setCookie.replace(/(.* Path=\/)(\w+)(;.*)?/, '$1$3'))
                }
            }
        }]
    }

    return config
}()
