import React, {useEffect, useMemo, useRef} from 'react'
import {IconButton} from '../../components'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'
import {useSettings} from '../../contexts/settings'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'
import {useHotkeys} from '../../contexts/hotkeys'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useHistory, useSearchParams} from '../../hooks/router'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {EntryList as EntryListComponent} from '../../components/EntryList/EntryList'
import {useEntries} from '../../hooks/entries'

const EntryList = withAutofocusEntry(EntryListComponent)

export function EntryStreamPage() {
  const {pageSize: size, showUnseenEntries} = useSettings()
  const {isDesktop} = useMediaBreakpoint()
  const {onKeyUp} = useHotkeys()
  const searchParams = useSearchParams()
  const ref = useRef(searchParams)
  const {push, reload} = useHistory()

  const query = useMemo(() => {
    const showAll = showUnseenEntries === true ? false : '*'
    const seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
    return {...searchParams, seenEqual, size}
  }, [searchParams, showUnseenEntries, size])

  const {
    entries,
    links,
    loading,
    fetchEntries,
    changeEntry,
    clearEntries
  } = useEntries()

  useEffect(() => {
    ref.current = searchParams
  }, [searchParams])

  const onChange = q => {
    clearEntries()
    push({
      searchParams: {
        ...searchParams,
        ...ref.current,
        q
      }
    })
  }

  const refresh = () => {
    clearEntries()
    fetchEntries({query})
    reload()
  }

  useEffect(() => {
    fetchEntries({query})
  }, [fetchEntries, query])

  const actionPanel =
    <React.Fragment>
      <SearchInput
        className='flex-grow'
        onChange={onChange}
        value={searchParams.q}
      />
      {isDesktop ?
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
        onClick={refresh}
      />
    </React.Fragment>

  const listPanel =
    <EntryList
      entries={entries}
      links={links}
      loading={loading}
      onChangeEntry={changeEntry}
      onLoadMore={fetchEntries}
    />

  return (
    <ListLayout
      actionPanel={actionPanel}
      listPanel={listPanel}
    />
  )
}
