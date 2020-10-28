import './SearchInput.css'
import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useDebouncedCallback} from 'use-debounce'
import {Icon} from '../Icon/Icon'
import {Input} from '../Input/Input'
import {isValuePresent} from '../../shared/utils'

function sanitizeValue(value) {
  return isValuePresent(value) ? value : ''
}

export function SearchInput(props) {
  const [currentValue, setCurrentValue] = useState(sanitizeValue(props.value))
  const debounced = useDebouncedCallback(inputValue => {
    props.onChange && props.onChange(inputValue.trim() === '' ? undefined : inputValue)
  }, 250)

  useEffect(() => {
    setCurrentValue(sanitizeValue(props.value))
  }, [props.value])

  return (
    <div
      className='my-search-input'
    >
      <Icon
        type='search'
      />
      <Input
        className='my-search-input__input'
        name='search-input'
        role='search'
        value={currentValue}
        onChange={({target: {value}}) => {
          setCurrentValue(value)
          debounced.callback(value)
        }}
      />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
}
