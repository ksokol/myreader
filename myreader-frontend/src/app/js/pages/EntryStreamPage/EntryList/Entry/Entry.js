import './Entry.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {EntryTitle} from './EntryTitle/EntryTitle'
import {EntryActions} from './EntryActions'
import {EntryContent} from './EntryContent/EntryContent'
import {EntryTags} from './EntryTags'
import {useSettings} from '../../../../contexts/settings'

export function Entry(props) {
  const {showEntryDetails} = useSettings()
  const [showMore, setShowMore] = useState(false)

  const toggleMore = () => {
    setShowMore(!showMore)
  }

  const toggleSeen = () => {
    props.onChangeEntry({
      ...props.item,
      seen: !props.item.seen
    })
  }

  const onTagUpdate = tags => {
    props.onChangeEntry({
      uuid: props.item.uuid,
      seen: props.item.seen,
      tags
    })
  }

  const {
    item,
    className = '',
    role,
    entryRef
  } = props

  return (
    <article
      className={`my-entry ${className}`}
      role={role}
      ref={entryRef}
    >
      <div
        className='my-entry__header'
      >
        <EntryTitle
          entry={item}
        />
        <EntryActions
          seen={item.seen}
          showMore={showMore}
          onToggleShowMore={toggleMore}
          onToggleSeen={toggleSeen}
        />
      </div>

      {showMore && (
        <EntryTags
          tags={item.tags}
          onChange={onTagUpdate}
        />
      )}

      <EntryContent
        visible={showEntryDetails || showMore}
        content={item.content}
      />
    </article>
  )
}

Entry.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    feedTitle: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    origin: PropTypes.string.isRequired,
    seen: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string
  }).isRequired,
  className: PropTypes.string,
  role: PropTypes.string,
  onChangeEntry: PropTypes.func.isRequired,
  entryRef: PropTypes.func
}
