import './chip.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {IconButton} from '../../components'
import {noop} from '../../shared/utils'

const Chip = props => {
  const isDisabled = props.disabled
  const isSelected = props.selected === props.keyFn()
  const isSelectable = !isSelected && !!props.onSelect && !isDisabled
  const onSelectFn = () => props.onSelect(props.value)
  const onSelect = isSelectable ? onSelectFn : noop

  const classes = classNames(
    'my-chip',
    {
      'my-chip--selected': isSelected,
      'my-chip--selectable': isSelectable,
      'my-chip--disabled': isDisabled
    }
  )

  const removeButton = props.onRemove &&
    <IconButton className="my-chip__remove-button"
                type="close"
                disabled={props.disabled}
                onClick={() => props.onRemove(props.value)}/>

  return (
    <div className={classes}>
      <div onClick={onSelect}>{props.children}</div>

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

export default Chip
