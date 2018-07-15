import './button.css'
import React from 'react'
import PropTypes from 'prop-types'

const Button = props => {
  const {
    type,
    disabled,
    onClick,
    children
  } = props

  return (
    <button className='my-button'
            type={type}
            onClick={onClick}
            disabled={disabled}>
      {children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node
}

Button.defaultProps = {
  type: 'button',
  disabled: false
}

export default Button
