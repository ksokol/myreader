import React from 'react'
import PropTypes from 'prop-types'
import {Input} from '../Input/Input'

export const AutocompleteInput = props => {
  const {
    value,
    values,
    onSelect,
    ...inputProps
  } = props

  const dataListId = `my-autocomplete-input__datalist-${Date.now()}`

  return (
    <React.Fragment>
      <Input
        {...inputProps}
        value={value ? value : ''}
        onChange={({target: {value}}) => onSelect(value.length > 0 ? value : null)}
        autoComplete='on'
        list={dataListId}
      />

      <datalist id={dataListId}>
        {values.map(value => <option key={value} value={value} />)}
      </datalist>
    </React.Fragment>
  )
}

AutocompleteInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
}
