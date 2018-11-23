import './SearchInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Input, withDebounce} from '../../components'

const DebounceInput = withDebounce(Input, 250)

const SearchInput = props => {
  // TODO Remove q query parameter from UI Router
  const onChange = value => props.onChange(value.trim() === '' ? undefined : value)

  return (
    <div className='my-search-input'>
      <Icon type='search' />
      <DebounceInput className='my-search-input__input'
                     name='search-input'
                     value={props.value}
                     onChange={onChange} />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

SearchInput.defaultProps = {
  value: ''
}

export default SearchInput
