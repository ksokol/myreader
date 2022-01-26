import './Checkbox.css'
import PropTypes from 'prop-types'

export function Checkbox({
  name,
  value,
  disabled,
  onChange,
  children
}) {
  return (
    <label className="myr-checkbox">
      <input
        name={name}
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={onChange}
      />
      <span>{children}</span>
    </label>
  )
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.any,
}
