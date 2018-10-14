import './Badge.css'
import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_COLOR = '#777'
const colorCache = new Map([[DEFAULT_COLOR, {red: 119, green: 119, blue: 119}]])

function determineRGB(color) {
  const ctx = document.createElement('canvas').getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [red, green, blue] = ctx.getImageData(0, 0, 1, 1).data
  return {red, green, blue}
}

class Badge extends React.Component {

  constructor(props) {
    super(props)

    this.badgeRef = React.createRef()
  }

  componentDidMount() {
    const color = this.props.color ? this.props.color.toLowerCase() : DEFAULT_COLOR
    let rgb = colorCache.get(color)

    if (!rgb) {
      rgb = determineRGB(color)
      colorCache.set(color, rgb)
    }

    const badgeRef = this.badgeRef.current
    badgeRef.style.setProperty("--red", rgb.red)
    badgeRef.style.setProperty("--green", rgb.green)
    badgeRef.style.setProperty("--blue", rgb.blue)
  }

  render() {
    return (
      <div className='my-badge' ref={this.badgeRef}>
        <span>{this.props.text}</span>
      </div>
    )
  }
}

Badge.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
}

export default Badge
