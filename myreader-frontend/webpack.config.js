'use strict'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
require('babel-plugin-angularjs-annotate')

const ENV = process.env.npm_lifecycle_event
const isTest = ENV === 'test' || ENV === 'test-watch'
const isReport = ENV === 'report'
const isProd = ENV === 'build' || isReport
const isServed = ENV === 'server'

const environment = isTest ? 'test' : isServed ? 'development' : 'production'

const BACKEND_PORT = 19340
const BACKEND_CONTEXT = 'myreader'
const PUBLIC_URL = environment === 'production' ? `/${BACKEND_CONTEXT}` : ''

module.exports = function makeWebpackConfig() {
  /**
   * Reference: http://webpack.github.io/docs/configuration.html
   */
  const config = {}

  config.mode = isProd ? 'production' : 'development'

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
   //  */
  config.output = isTest ? {} : {
    path: __dirname + '/dist',
    filename: isProd ? 'app/[name].[contenthash].js' : '[name].bundle.js',
    chunkFilename: isProd ? 'app/[name].[contenthash].js' : '[name].bundle.js'
  }

  config.optimization = {
    runtimeChunk: true,
    noEmitOnErrors: true,
    concatenateModules: true,
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: 'vendor',
          priority: -10,
          name: 'vendor',
          chunks: 'all'
        },
        app: {
          test: 'app',
          priority: -20
        }
      }
    }
  }

  /**
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isServed) {
      config.devtool = 'inline-source-map'
  }

  /**
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      test: /\.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/,
      query: {
        publicPath: '../',
        outputPath: 'app/'
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
      loader: 'svg-url-loader'
    },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }]
  }

  /**
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    new CleanWebpackPlugin(['dist']),
    new BundleAnalyzerPlugin({analyzerMode: isReport ? 'server' : 'disabled'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment),
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
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

      new MiniCssExtractPlugin({
        filename: 'app/[name].[contenthash].css',
        disable: !isProd,
        allChunks: true
      })
    )
  }

  if (isProd) {
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_URL + '/index.html'
      }),
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
          appleIcon: false,
          appleStartup: false,
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
    host: '0.0.0.0',
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
