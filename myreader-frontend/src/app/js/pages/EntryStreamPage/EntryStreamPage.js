import React, {useEffect, useRef} from 'react'
import {IconButton} from '../../components'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useHistory, useSearchParams} from '../../hooks/router'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {EntryList as EntryListComponent} from '../../components/EntryList/EntryList'

const EntryList = withEntriesFromApi(withAutofocusEntry(EntryListComponent))

export function EntryStreamPage() {
  const {pageSize: size, showUnseenEntries} = useSettings()
  const {mediaBreakpoint} = useMediaBreakpoint()
  const {onKeyUp} = useHotkeys()
  const searchParams = useSearchParams()
  const ref = useRef(searchParams)
  const {push, reload} = useHistory()

  const showAll = showUnseenEntries === true ? false : '*'
  const seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
  const query = {...searchParams, seenEqual, size}

  useEffect(() => {
    ref.current = searchParams
  }, [searchParams])

  const onChange = q => {
    push({
      searchParams: {
        ...searchParams,
        ...ref.current,
        q
      }
    })
  }

  const actionPanel =
    <React.Fragment>
      <SearchInput
        className='flex-grow'
        onChange={onChange}
        value={searchParams.q}
      />
      {mediaBreakpoint === 'desktop' ?
        <React.Fragment>
          <IconButton
            type='chevron-left'
            onClick={() => onKeyUp({key: 'ArrowLeft'})}
          />
          <IconButton
            type='chevron-right'
            onClick={() => onKeyUp({key: 'ArrowRight'})}
          />
        </React.Fragment> : null
      }
      <IconButton
        type='redo'
        onClick={reload}
      />
    </React.Fragment>

  const listPanel =
    <EntryList
      query={query}
    />

  return (
    <ListLayout
      actionPanel={actionPanel}
      listPanel={listPanel}
    />
  )
}
