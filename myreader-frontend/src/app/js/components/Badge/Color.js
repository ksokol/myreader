const DEFAULT_COLOR = '#777'
const colorCache = new Map([[DEFAULT_COLOR, {red: 119, green: 119, blue: 119}]])

function determineRGB(color) {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [red, green, blue] = ctx.getImageData(0, 0, 1, 1).data
  return {red, green, blue}
}

export class Color {

  static get(colorIn) {
    const color = colorIn ? colorIn.toLowerCase() : DEFAULT_COLOR
    let rgb = colorCache.get(color)

    if (!rgb) {
      rgb = determineRGB(color)
      colorCache.set(color, rgb)
    }

    return rgb
  }
}
