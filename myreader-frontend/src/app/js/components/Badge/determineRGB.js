const DEFAULT_HEX_COLOR = '#777'

const toDecimalColor = (a, b = a) => +`0x${a}${b}`

export default function determineRGB(hexColorIn) {
  const hexColor = hexColorIn ? hexColorIn.toLowerCase() : DEFAULT_HEX_COLOR
  let red = 0, green = 0, blue = 0

  if (hexColor.length === 4) {
    red = toDecimalColor(hexColor[1])
    green = toDecimalColor(hexColor[2])
    blue = toDecimalColor(hexColor[3])
  } else if (hexColor.length === 7) {
    red = toDecimalColor(hexColor[1], hexColor[2])
    green = toDecimalColor(hexColor[3], hexColor[4])
    blue = toDecimalColor(hexColor[5], hexColor[6])
  }

  return {red, green, blue}
}
