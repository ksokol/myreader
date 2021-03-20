import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '../../../../components/Buttons'

export function EntryActions(props) {
  return (
    <div className='my-entry__actions'>
      <IconButton
        type={`chevron-${props.showMore ? 'up' : 'down'}`}
        role={props.showMore ? 'less-details' : 'more-details'}
        onClick={props.onToggleShowMore}
      />
      <IconButton
        type={`check${props.seen ? '-circle' : ''}`}
        role={props.seen ? 'flag-as-unseen' : 'flag-as-seen'}
        onClick={props.onToggleSeen}
      />
    </div>
  )
}

EntryActions.propTypes = {
  showMore: PropTypes.bool,
  onToggleShowMore: PropTypes.func.isRequired,
  seen: PropTypes.bool.isRequired,
  onToggleSeen: PropTypes.func.isRequired
}
