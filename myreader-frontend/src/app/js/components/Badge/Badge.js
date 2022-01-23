import './Badge.css'
import {useMemo} from 'react'
import PropTypes from 'prop-types'
import determineRGB from './determineRGB'

export function Badge({text, color, role}) {
  const rgb = useMemo(() => {
    return determineRGB(color)
  }, [color])

  return (
    <div
      style={{
        '--red': rgb.red,
        '--green': rgb.green,
        '--blue': rgb.blue,
      }}
      className='my-badge'
      role={role || 'badge'}
    >
      <span>{text}</span>
    </div>
  )
}

Badge.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  role: PropTypes.string,
}
