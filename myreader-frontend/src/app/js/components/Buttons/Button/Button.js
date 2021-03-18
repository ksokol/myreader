import './Button.css'
import React from 'react'
import PropTypes from 'prop-types'

export function Button({
  type,
  role,
  primary,
  disabled,
  caution,
  className,
  onClick,
  children
}) {
  const classes = ['my-button']

  if (primary) {
    classes.push('my-button--primary')
  }
  if (caution) {
    classes.push('my-button--caution')
  }
  if (className) {
    classes.push(className)
  }

  return (
    <button
      className={classes.join(' ')}
      type={type}
      role={role}
      onClick={onClick}
      disabled={disabled}
    >{children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  role: PropTypes.string,
  primary: PropTypes.bool,
  caution: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node
}

Button.defaultProps = {
  type: 'button',
  role: 'button',
  disabled: false
}
