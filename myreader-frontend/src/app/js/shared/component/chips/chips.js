import React from 'react'
import PropTypes from 'prop-types'
import {Chip} from './chip'

export const Chips = props =>
    <div className="my-chips">
        {props.values.map(value =>
            <Chip key={value}
                  value={value}
                  onSelect={props.onSelect}
                  selected={props.selected}>
            </Chip>
        )}
    </div>

Chips.propTypes = {
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.string,
    onSelect: PropTypes.func
}
