import './EntryTitle.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Badge} from '../../../../../components/Badge/Badge'
import {TimeAgo} from '../../../../../components/TimeAgo/TimeAgo'

export function EntryTitle(props) {
  const {
    origin,
    title,
    createdAt,
    feedTitle,
    feedTag,
    feedTagColor
  } = props.entry
  return (
    <div className='my-entry-title'>
      <a
        className="my-entry-title__title"
        href={origin}
        target="_blank"
        rel="noopener noreferrer">{title}
      </a>
      <div
        className="my-entry-title__subtitle"
      >
        <span>
          <TimeAgo date={createdAt}/> on {feedTitle}
        </span>
        {feedTag && (
          <Badge
            text={feedTag}
            color={feedTagColor}
            role='feed-badge'
          />
        )}
      </div>
    </div>
  )
}

EntryTitle.propTypes = {
  entry: PropTypes.shape({
    origin: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    feedTitle: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    feedTag: PropTypes.string,
    feedTagColor: PropTypes.string
  })
}
