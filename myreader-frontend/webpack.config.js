const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")

const ENV = process.env.npm_lifecycle_event
const isTest = ENV === 'test' || ENV === 'test-watch'
const isReport = ENV === 'report'
const isProd = ENV === 'build' || isReport
const isServed = ENV === 'server'

const BACKEND_PORT = 19340
const BACKEND_CONTEXT = 'myreader'

module.exports = function(env) {
  const config = {}

  config.mode = isProd ? 'production' : 'development'
  config.stats = 'verbose'
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
    noEmitOnErrors: true,
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6
        }
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isServed) {
    config.devtool = 'inline-source-map'
  }

  config.module = {
    rules: [{
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      test: /\.svg$/,
      type: 'asset/inline',
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
        template: './public/index.html',
        inject: 'body',
        //favicon: './public/favicon.ico',
        minify: {
          collapseWhitespace: true
        },
        templateParameters: {
          'version': env?.version || 'unknown',
          'commit': env?.commitId || 'unknown',
        },
      }),
      new MiniCssExtractPlugin({
        filename: 'app/[name].[contenthash].css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: path.resolve('./dist'),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      })
    )
  }

  config.devServer = {
    static : {
      directory: './src',
    },
    devMiddleware: {
      stats: 'minimal',
    },
    host: '0.0.0.0',
    proxy: [{
      context: [`/${BACKEND_CONTEXT}`, '/info', '/api', '/views', '/check', '/logout'],
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
}
