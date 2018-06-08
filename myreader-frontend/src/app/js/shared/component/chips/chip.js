import './chip.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

export const Chip = props => {
    const isSelected = props.selected === props.value
    const isSelectable = !isSelected && !!props.onSelect
    const onSelectFn = () => props.onSelect(props.value)
    const onSelect = isSelectable ? onSelectFn : undefined

    const classes = classNames(
        'my-chip',
        {
            'my-chip--selected': isSelected,
            'my-chip--selectable': isSelectable
        }
    )

    return (
        <div className={classes}>
            <span onClick={onSelect}>{props.value}</span>
        </div>
    )
}

Chip.propTypes = {
    value: PropTypes.string.isRequired,
    selected: PropTypes.string,
    onSelect: PropTypes.func
}
