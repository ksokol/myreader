import './Option.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {Button} from '..'
import {isObject} from '../../shared/utils'

const getLabel = option => (isObject(option) ? option.label : option).toString()
const getValue = option => isObject(option) ? option.value : option

const Option = props =>
  <div className='my-option'>
    {props.options.map(option =>
      <Button
        key={getValue(option)}
        className={classNames({'my-option__button--selected': props.value === getValue(option)})}
        onClick={() => props.onSelect(getValue(option))}>
          {getLabel(option)}
      </Button>
    )}
  </div>

const allowedOptionTypes = [
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool
]

Option.propTypes = {
  value: PropTypes.oneOfType(allowedOptionTypes).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      ...allowedOptionTypes,
      PropTypes.shape({
        label: PropTypes.oneOfType(allowedOptionTypes).isRequired,
        value: PropTypes.oneOfType(allowedOptionTypes).isRequired
      })
    ])
  ).isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Option
