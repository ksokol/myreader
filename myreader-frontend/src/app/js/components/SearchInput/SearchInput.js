import './SearchInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Input, withDebounce} from '../../components'
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
