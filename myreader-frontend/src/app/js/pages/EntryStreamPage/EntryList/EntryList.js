import './EntryList.css'
import PropTypes from 'prop-types'
import {InView} from 'react-intersection-observer'
import {Button} from '../../../components/Buttons'
import {EntryAutoFocus} from './Entry/EntryAutoFocus'

function EntryListItem(props) {
  const {onChangeEntry, focusUuid, ...rest} = props

  return (
    <div className="my-entry-list__item" key={props.uuid}>
      <EntryAutoFocus {...{item: rest}} onChangeEntry={onChangeEntry} focusUuid={focusUuid}/>
    </div>
  )
}

EntryListItem.propTypes = {
  uuid: PropTypes.string.isRequired,
  focusUuid: PropTypes.string,
  onChangeEntry: PropTypes.func.isRequired,
}

export function EntryList({
  entries = [],
  nextPage = null,
  onLoadMore,
  entryInFocusUuid,
  loading,
  onChangeEntry,
}) {
  const hasNextPage = () => {
    return nextPage !== null
  }

  const loadMore = () => {
    onLoadMore(nextPage)
  }

  const otherProps = {
    onChangeEntry,
    focusUuid: entryInFocusUuid
  }

  const entriesCopy = [...entries]
  const lastEntry = entriesCopy.pop()

  return (
    <div
      className='my-entry-list'
    >
      {entriesCopy.map(entryProps => (
        <EntryListItem key={entryProps.uuid} {...entryProps} {...otherProps} />
      ))}

      {lastEntry && hasNextPage() ? (
        <InView
          skip={loading}
          onChange={(inView) => {
            if (inView) {
              loadMore()
            }
          }}
        >
          <EntryListItem {...lastEntry} {...otherProps} />
        </InView>
      )
        : lastEntry && <EntryListItem {...lastEntry} {...otherProps} />
      }

      {hasNextPage() && (
        <Button
          role='more'
          className='my-button__load-more'
          disabled={loading}
          onClick={loadMore}
        >Load More
        </Button>
      )}
    </div>
  )
}

EntryList.propTypes = {
  nextPage: PropTypes.object,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired
    })
  ),
  entryInFocusUuid: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
}
