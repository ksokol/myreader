import './SearchInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../Icon/Icon'
import {Input} from '../Input/Input'
import {isValuePresent} from '../../shared/utils'

export function SearchInput(props) {
  return (
    <div
      className={`my-search-input ${props.className}`}
    >
      <Icon
        type='search'
        inverse={props.inverse}
      />
      <Input
        className={`my-search-input__input ${props.inverse ? 'my-search-input__input--inverse' : ''}`}
        name='search-input'
        role='search'
        value={isValuePresent(props.value) ? props.value : ''}
        onChange={({target: {value}}) => {
          props.onChange && props.onChange(value.trim() === '' ? undefined : value)
        }}
      />
    </div>
  )
}

SearchInput.defaultProps = {
  className: '',
}

SearchInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  inverse: PropTypes.bool,
  onChange: PropTypes.func,
}
