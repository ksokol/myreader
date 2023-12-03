import './EntryList.css'
import {useEffect} from 'react'
import {useInView} from './useInView'
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

  useEffect(() => {
    if (inView) {
      onLoadMore()
    }
  }, [inView, onLoadMore])

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
          onClick={onLoadMore}
        >Load More
        </Button>
      )}
    </>
  )
}
