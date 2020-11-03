import React, {useEffect, useMemo} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {IconButton} from '../../components'
import {useAutofocusEntry} from './useAutofocusEntry'
import {useSettings} from '../../contexts/settings'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useHistory, useSearchParams} from '../../hooks/router'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {EntryList} from '../../components/EntryList/EntryList'
import {useEntries} from '../../hooks/entries'
import {toast} from '../../components/Toast'

export function EntryStreamPage() {
  const {pageSize: size, showUnseenEntries} = useSettings()
  const searchParams = useSearchParams()
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
    lastError,
    fetchEntries,
    changeEntry,
    setSeenFlag,
    toggleSeenFlag,
    clearEntries
  } = useEntries()

  const {
    entryInFocusUuid,
    setEntries,
    focusNext,
    focusPrevious,
  } = useAutofocusEntry()

  const onChange = q => {
    push({
      searchParams: {
        ...searchParams,
        q
      }
    })
  }

  const refresh = () => {
    clearEntries()
    fetchEntries({query})
    reload()
  }

  useHotkeys('right', () => {
    focusNext()
  })

  useHotkeys('left' ,() => {
    focusPrevious()
  })

  useHotkeys('escape' ,() => {
    if (entryInFocusUuid) {
      toggleSeenFlag(entryInFocusUuid)
    }
  }, [entryInFocusUuid])

  useEffect(() => {
    fetchEntries({query})
  }, [fetchEntries, query])

  useEffect(() => {
    setEntries(entries)
  }, [entries, setEntries])

  useEffect(() => {
    if (entryInFocusUuid) {
      setSeenFlag(entryInFocusUuid)
    }
  }, [entryInFocusUuid, setSeenFlag])

  useEffect(() => {
    clearEntries()
  }, [clearEntries, searchParams])

  useEffect(() => {
    if (lastError) {
      toast(lastError.data, {error: true})
    }
  }, [lastError])

  return (
    <ListLayout
      actionPanel={
        <>
          <SearchInput
            onChange={onChange}
            value={searchParams.q}
          />
          <IconButton
            className='hidden-phone hidden-tablet'
            type='chevron-left'
            role='previous'
            onClick={focusPrevious}
          />
          <IconButton
            className='hidden-phone hidden-tablet'
            type='chevron-right'
            role='next'
            onClick={focusNext}
          />
          <IconButton
            type='redo'
            role='refresh'
            onClick={refresh}
          />
        </>
      }
      listPanel={
        <EntryList
          entries={entries}
          links={links}
          loading={loading}
          entryInFocusUuid={entryInFocusUuid}
          onChangeEntry={changeEntry}
          onLoadMore={fetchEntries}
        />
      }
    />
  )
}
