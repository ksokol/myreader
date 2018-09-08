import './button.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Button = props => {
  const {
    type,
    disabled,
    className,
    onClick,
    children
  } = props

  const classes = classNames('my-button', className)

  return (
    <button className={classes}
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
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node
}

Button.defaultProps = {
  type: 'button',
  disabled: false
}

export default Button
