import './Icon.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Icon = props => {
  const className = classNames(
    'my-icon',
    `my-icon__${props.type}`,
    `my-icon--${props.color}`,
    {
      'my-icon--disabled': props.disabled
    }
  )

  return <span className={className}/>
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['grey', 'white']),
  disabled: PropTypes.bool
}

Icon.defaultProps = {
  color: 'grey',
  disabled: false
}

export default Icon
