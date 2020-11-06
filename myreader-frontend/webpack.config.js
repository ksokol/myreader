const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const ENV = process.env.npm_lifecycle_event
const isTest = ENV === 'test' || ENV === 'test-watch'
const isReport = ENV === 'report'
const isProd = ENV === 'build' || isReport
const isServed = ENV === 'server'

const BACKEND_PORT = 19340
const BACKEND_CONTEXT = 'myreader'

module.exports = function() {
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
    publicPath: ''
  }

  config.optimization = {
    runtimeChunk: true,
    noEmitOnErrors: true,
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6
        }
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
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      test: /\.html$/,
      exclude: /node_modules/,
      use: 'raw-loader'
    }, {
      test: /\.svg$/,
      loader: 'svg-url-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: isProd ? ['transform-react-remove-prop-types'] : []
        }
      }
    }]
  }

  config.plugins = [
    new BundleAnalyzerPlugin({analyzerMode: isReport ? 'server' : 'disabled'}),
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
      new WebpackPwaManifest({
        filename: 'manifest.[hash].json',
        includeDirectory: true,
        name: 'MyReader',
        short_name: 'MyReader',
        lang: 'en-US',
        background_color: '#fff',
        theme_color: '#3f51b5',
        orientation: 'any',
        display: 'standalone',
        icons: [
          {
            src: path.resolve('./src/app/img/favicon.png'),
            destination: 'assets',
            sizes: [36, 48, 72, 96, 128, 192, 256, 384, 512],
            type: 'image/png'
          }
        ]
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        inlineWorkboxRuntime: false,
        cleanupOutdatedCaches: true,
        offlineGoogleAnalytics: false,
      })
    )
  }

  config.devServer = {
    contentBase: './src',
    stats: 'minimal',
    host: '0.0.0.0',
    proxy: [{
      context: [`/${BACKEND_CONTEXT}`, '/info', '/api', '/check', '/logout'],
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
