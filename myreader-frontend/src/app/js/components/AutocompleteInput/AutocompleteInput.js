import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Input} from '../Input/Input'

export function AutocompleteInput({
  value: inputValue,
  values,
  onSelect,
  ...inputProps
}) {
  const dataListId = useMemo(() => `my-autocomplete-input__datalist-${Date.now()}`, [])

  return (
    <>
      <Input
        {...inputProps}
        value={inputValue ? inputValue : ''}
        onChange={({target: {value}}) => onSelect(value.length > 0 ? value : null)}
        list={dataListId}
      />

      <datalist
        id={dataListId}
      >
        {values.map(value => (
          <option
            key={value}
            value={value}
          />
        ))}
      </datalist>
    </>
  )
}

AutocompleteInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
}
