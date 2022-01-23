import './EntryList.css'
import {useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {useInView} from 'react-intersection-observer'
import {Button} from '../../../components/Buttons'
import {EntryAutoFocus} from './Entry/EntryAutoFocus'

export function EntryList({
  entries = [],
  hasNextPage,
  entryInFocusUuid,
  loading,
  onLoadMore,
  onChangeEntry,
}) {
  const { ref, inView } = useInView({
    skip: loading,
  })

  const loadMore = useCallback(() => {
    onLoadMore()
  }, [onLoadMore])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <>
      <div
        className='my-entry-list'
      >
        {entries.map((entry, index) => (
          <div
            key={entry.uuid}
            ref={index === entries.length - 1 && hasNextPage ? ref : null}
            className="my-entry-list__item"
          >
            <EntryAutoFocus
              item={entry}
              onChangeEntry={onChangeEntry}
              focusUuid={entryInFocusUuid}
            />
          </div>
        ))}


      </div>
      {hasNextPage && (
        <Button
          role='more'
          disabled={loading}
          onClick={loadMore}
        >Load More
        </Button>
      )}
    </>
  )
}

EntryList.propTypes = {
  hasNextPage: PropTypes.bool.isRequired,
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
