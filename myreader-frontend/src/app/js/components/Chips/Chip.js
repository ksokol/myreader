import './Chip.css'
import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '..'

export function Chip(props) {
  const isDisabled = props.disabled
  const isSelected = props.selected === props.keyFn()
  const isSelectable = !isSelected && !!props.onSelect && !isDisabled

  const classes = ['my-chip']

  if (isSelected) {
    classes.push('my-chip--selected')
  }
  if (isSelectable) {
    classes.push('my-chip--selectable')
  }
  if (isDisabled) {
    classes.push('my-chip--disabled')
  }

  const removeButton = props.onRemove &&
    <IconButton
      className='my-chip__remove-button'
      type='times'
      disabled={props.disabled}
      onClick={() => props.onRemove(props.value)}
    />

  return (
    <div
      className={classes.join(' ')}
      role='chip'
    >
      <div
        onClick={() => {
          if (isSelectable && props.onSelect) {
            props.onSelect(props.value)
          }
        }}
      >{props.children}
      </div>
      {removeButton}
    </div>
  )
}

Chip.propTypes = {
  keyFn: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  selected: PropTypes.string,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  children: PropTypes.node
}

Chip.defaultProps = {
  disabled: false
}
