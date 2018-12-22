import './SearchInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {Icon, Input, withDebounce} from '../../components'

const DebounceInput = withDebounce(Input, 250)

const SearchInput = props => {
  // TODO Remove q query parameter from UI Router
  const onChange = ({target: {value}}) => props.onChange(value.trim() === '' ? undefined : value)

  return (
    <div className={classNames('my-search-input', props.className)}>
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
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

SearchInput.defaultProps = {
  value: ''
}

export default SearchInput
