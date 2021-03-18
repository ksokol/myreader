import './Badge.css'
import React, {useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import determineRGB from './determineRGB'

export function Badge({text, color, role}) {
  const badgeRef = useRef(null)

  const updateBadgeColor = useCallback(() => {
    const rgb = determineRGB(color)
    const current = badgeRef.current

    current.style.setProperty('--red', rgb.red)
    current.style.setProperty('--green', rgb.green)
    current.style.setProperty('--blue', rgb.blue)
  }, [color])

  useEffect(() => {
    updateBadgeColor()
  }, [color, updateBadgeColor])

  return (
    <div
      className='my-badge'
      role={role || 'badge'}
      ref={badgeRef}
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
