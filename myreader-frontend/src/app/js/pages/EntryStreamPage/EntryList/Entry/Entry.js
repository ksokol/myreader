import {useState} from 'react'
import {EntryTitle} from './EntryTitle/EntryTitle'
import {EntryContent} from './EntryContent/EntryContent'
import {useSettings} from '../../../../contexts/settings'
import {IconButton} from '../../../../components/Buttons'

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
        <div className='my-entry__actions'>
          {!showEntryDetails && <IconButton
            type={`chevron-${showMore ? 'up' : 'down'}`}
            role={showMore ? 'less-details' : 'more-details'}
            onClick={toggleMore}
          />}
          <IconButton
            type={`check${item.seen ? '-circle' : ''}`}
            role={item.seen ? 'flag-as-unseen' : 'flag-as-seen'}
            onClick={toggleSeen}
          />
        </div>
      </div>

      <EntryContent
        visible={showEntryDetails || showMore}
        content={item.content}
      />
    </article>
  )
}
