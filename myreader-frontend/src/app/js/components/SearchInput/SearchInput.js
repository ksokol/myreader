import './SearchInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '../../components/Icon/Icon'
import {Input} from '../../components/Input/Input'
import withDebounce from '../../components/Input/withDebounce'
import {isValuePresent} from '../../shared/utils'

const DebounceInput = withDebounce(Input, 250)

const SearchInput = props => {
  const onChange = ({target: {value}}) => props.onChange(value.trim() === '' ? undefined : value)
  const value = isValuePresent(props.value) ? props.value : ''

  return (
    <div className={`my-search-input ${props.className}`}>
      <Icon
        type='search'
      />
      <DebounceInput
        className='my-search-input__input'
        name='search-input'
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default SearchInput
