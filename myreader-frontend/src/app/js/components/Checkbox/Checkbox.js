import './Checkbox.css'

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
