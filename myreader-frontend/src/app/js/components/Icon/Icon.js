import './Icon.css'
import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

const inverseColor = '#FFFFFF'
const defaultColor = '#808080'

export const Icon = ({type, inverse}) => {
  const iconRef = useRef(null)

  useEffect(() => {
    iconRef.current.style.setProperty('--color', inverse ? inverseColor : defaultColor)
  })

  return (
    <span
      ref={iconRef}
      role={`icon-${type}`}
      className={`my-icon my-icon__${type}`}
    />
  )
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  inverse: PropTypes.bool
}
