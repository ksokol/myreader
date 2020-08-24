import React from 'react'
import {EntryList as EntryListComponent, IconButton} from '../../components'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useSearchParams} from '../../hooks/router'

const EntryList = withEntriesFromApi(withAutofocusEntry(EntryListComponent))

export function EntryStreamPage() {
  const {pageSize: size, showUnseenEntries} = useSettings()
  const {mediaBreakpoint} = useMediaBreakpoint()
  const {onKeyUp} = useHotkeys()
  const searchParams = useSearchParams()

  const showAll = showUnseenEntries === true ? false : '*'
  const seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
  const query = {...searchParams, seenEqual, size}

  const actionPanel = mediaBreakpoint === 'desktop' ?
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
