class WebpackPwaManifest {
  constructor (options = {}) {
    this._generator = null
    this.assets = null
    this.htmlPlugin = false
    const shortName = options.short_name || options.name || 'App'

    this.options = Object.assign({
      filename: options.fingerprints ? '[name].[hash].[ext]' : '[name].[ext]',
      name: 'App',
      short_name: shortName,
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true,
      ios: false,
      publicPath: null,
      includeDirectory: true,
      crossorigin: null
    }, options)
  }

  apply (compiler) {



    const generator = this._generator || require('./generators/tapable')
    generator(this, compiler)



  }
}

module.exports = WebpackPwaManifest
