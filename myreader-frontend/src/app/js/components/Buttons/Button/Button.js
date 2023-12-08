import React from 'react'

export function Button({
  type = 'button',
  role = 'button',
  primary,
  disabled = false,
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
