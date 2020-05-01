const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

function WebpackPwaManifest(options) {
  return compiler => {
    compiler.hooks.compilation.tap('webpack-pwa-manifest', compilation => {
      options = {
        ...options,
        publicPath: compilation.options.output.publicPath || '',
        outputPath: `${compilation.options.output.path}/${options.outputPath}`
      }

      const alterAssetTagsHook = compilation.hooks.htmlWebpackPluginAlterAssetTags

      alterAssetTagsHook.tap('webpack-pwa-manifest', htmlPluginData => {
        const manifest = readPwaManifestFile(options)

        validatePwaManifest(options, manifest)
        copyPwaManifestIcons(options, manifest)
        addPwaManifestToCompilationAssets(compilation, manifest)
        injectPwaManifestIntoHtml(htmlPluginData, manifest)
      })
    })
  }
}

function readPwaManifestFile({template, outputPath, publicPath}) {
  const source = fs.readFileSync(template, 'utf8')
  const output = path.join(
    path.parse(outputPath).base,
    createFilename(template, source)
  )

  return {
    output,
    url: `${publicPath}${output}`,
    size: source.length,
    source
  }
}

function validatePwaManifest({template}, manifest) {
  const srcDir = path.parse(template).dir
  const icons = JSON.parse(manifest.source).icons || []

  for (const icon of icons) {
    const src = path.join(srcDir, icon.src)

    if (!fs.existsSync(src)) {
      throw new Error(`manifest icon ${src} not found`)
    }
  }
}

function copyPwaManifestIcons({template, outputPath}, manifest) {
  const srcDir = path.parse(template).dir
  const targetDir = path.parse(outputPath).base
  const icons = JSON.parse(manifest.source).icons || []

  for (const icon of icons) {
    //const src = path.join(srcDir, icon.src)
    const target = path.join(outputPath, icon.src)

    console.log("target", target)
    console.log("------")

   // fs.createReadStream(src).pipe(fs.createWriteStream(target))

  }
}

function addPwaManifestToCompilationAssets(compilation, manifest) {
  compilation.assets[manifest.output] = {
    source: () => manifest.source,
    size: () => manifest.size
  }
}

function injectPwaManifestIntoHtml(htmlPluginData, manifest) {
  htmlPluginData.head.push({
    tagName: 'link',
    selfClosingTag: false,
    voidTag: true,
    attributes: {
      href: manifest.url,
      rel: 'manifest'
    }
  })
}

function createFilename(template, json) {
  const base = path.parse(template).base
  const split = base.split('.')
  const hash = crypto.createHash('md5').update(json).digest('hex')
  return `${split[0]}.${hash}.${split[1]}`
}

module.exports = WebpackPwaManifest
