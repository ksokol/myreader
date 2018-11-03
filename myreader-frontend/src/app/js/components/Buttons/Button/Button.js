import './Button.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Button = props => {
  const {
    type,
    primary,
    disabled,
    className,
    onClick,
    children
  } = props

  const classes = classNames(
    'my-button',
    {'my-button--primary': primary},
    className
  )

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
  primary: PropTypes.bool,
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
