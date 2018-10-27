import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '../../..'

export const EntryActions = props => [
  <IconButton
    key='more-toggle'
    type={`chevron-${props.showMore ? 'up' : 'down'}`}
    onClick={props.onToggleShowMore}/>,
  <IconButton
    key='seen-toggle'
    type={`check${props.seen ? '-circle' : ''}`}
    onClick={props.onToggleSeen}/>
]

EntryActions.propTypes = {
  showMore: PropTypes.bool,
  onToggleShowMore: PropTypes.func.isRequired,
  seen: PropTypes.bool.isRequired,
  onToggleSeen: PropTypes.func.isRequired
}
