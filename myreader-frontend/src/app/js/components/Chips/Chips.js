import './Chips.css'
import {useState} from 'react'
import {Input} from '../Input/Input'
import {IconButton} from '../Buttons'

function Chip({
  disabled = false,
  value = [],
  onRemove,
  children
}) {
  const removeButton = onRemove &&
    <IconButton
      className='my-chip__remove-button'
      type='times'
      disabled={disabled}
      role='chip-remove-button'
      onClick={() => onRemove(value)}
    />

  return (
    <div
      className='my-chip'
      aria-disabled={disabled}
      role='chip'
    >
      <div>{children}</div>
      {removeButton}
    </div>
  )
}

export function Chips({
  className,
  keyFn,
  values,
  placeholder,
  disabled,
  onRemove,
  onAdd,
  renderItem
}) {
  const [inputValue, setInputValue] = useState('')

  const onEnter = () => {
    if (inputValue.length > 0) {
      onAdd(inputValue)
    }
    setInputValue('')
  }

  return (
    <div
      className={`my-chips ${className || ''}`}
    >
      <div>
        {values.map(value =>
          <Chip
            key={keyFn(value)}
            value={value}
            onRemove={onRemove}
            aria-disabled={disabled}
            disabled={disabled}>
            {renderItem(value)}
          </Chip>
        )}
      </div>

      {onAdd && (
        <Input
          name='chip-input'
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={event => setInputValue(event.target.value)}
          onEnter={onEnter}
        />)
      }
    </div>
  )
}
