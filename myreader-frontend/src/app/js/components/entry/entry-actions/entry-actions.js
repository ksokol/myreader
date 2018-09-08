import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '../../../components'

export const EntryActions = props => [
  <IconButton
    key='more-toggle'
    type={`expand-${props.showMore ? 'less' : 'more'}`}
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
