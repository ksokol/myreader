import {Icon} from '../../Icon/Icon'

export function IconButton({
  className = '',
  type,
  role,
  disabled = false,
  inverse,
  onClick
}) {
  return (
    <button
      type='button'
      className={`my-icon-button ${className}`}
      role={role || `button-${type}`}
      disabled={disabled}
      onClick={event => onClick && onClick(event)}>
      <Icon
        type={type}
        inverse={inverse}
      />
    </button>
  )
}
