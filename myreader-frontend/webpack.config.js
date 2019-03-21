'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

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
  const config = {}

  config.mode = isProd ? 'production' : 'development'

  config.stats = 'verbose'

  /**
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? void 0 : {
    app: './src/app/js/index.js'
  }

  config.output = isTest ? {} : {
    path: path.resolve('./dist'),
    filename: isProd ? 'app/[name].[contenthash].js' : '[name].bundle.js',
    chunkFilename: isProd ? 'app/[name].[contenthash].js' : '[name].bundle.js',
    publicPath: `${PUBLIC_URL}/`
  }

  config.optimization = {
    runtimeChunk: true,
    noEmitOnErrors: true,
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  }

  config.resolve = {
    alias: {
      'react-router-dom': path.resolve(__dirname, 'src/app/js/migrations/react-router-dom')
    }
  }

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
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: isProd ? ['transform-react-remove-prop-types'] : []
          }
        }
      }]
  }

  /**
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({analyzerMode: isReport ? 'server' : 'disabled'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(environment),
      'process.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
    })
  ]

  if (!isTest) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        favicon: './src/app/img/favicon.ico',
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
        navigateFallback: `${PUBLIC_URL}/`
      }),

      new WebpackPwaManifest({
        filename: "app/manifest.[hash].json",
        includeDirectory: true,
        name: 'MyReader',
        short_name: 'MyReader',
        lang: 'en-US',
        background_color: '#fff',
        theme_color: '#3f51b5',
        orientation: 'any',
        display: 'standalone',
        start_url: `${PUBLIC_URL}/`,
        scope: `${PUBLIC_URL}/`,
        icons: [
          {
            src: path.resolve('./src/app/img/favicon.png'),
            destination: 'assets',
            sizes: [36, 48, 72, 96, 128, 192, 256, 384, 512],
            type: 'image/png'
          }
        ]
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
