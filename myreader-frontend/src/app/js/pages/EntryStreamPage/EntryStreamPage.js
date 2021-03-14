import React, {useEffect, useState, useMemo} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {IconButton} from '../../components'
import {useAutofocusEntry} from './useAutofocusEntry'
import {useSettings} from '../../contexts/settings'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useSearchParams} from '../../hooks/router'
import {EntryList} from '../../components/EntryList/EntryList'
import {useEntries} from '../../hooks/entries'
import {toast} from '../../components/Toast'
import {useSubscriptions} from '../../hooks/subscriptions'

export function EntryStreamPage() {
  const {showUnseenEntries} = useSettings()
  const searchParams = useSearchParams()
  const [showingUnseenEntries, setShowingUnseenEntries] = useState(showUnseenEntries)

  const query = useMemo(() => {
    const showAll = showUnseenEntries === true ? false : undefined
    const seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
    return {...searchParams, seenEqual}
  }, [searchParams, showUnseenEntries])

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
    fetchSubscriptions
  } = useSubscriptions()

  const {
    entryInFocusUuid,
    setEntries,
    focusNext,
    focusPrevious,
  } = useAutofocusEntry()

  const refresh = () => {
    if (!loading) {
      clearEntries()
      fetchEntries({query})
      fetchSubscriptions()
    }
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

  useEffect(() => {
    if (showUnseenEntries !== showingUnseenEntries) {
      clearEntries()
      setShowingUnseenEntries(showUnseenEntries)
    }
  }, [clearEntries, showUnseenEntries, showingUnseenEntries])

  return (
    <ListLayout
      actionPanel={
        <>
          <IconButton
            className='hidden-phone hidden-tablet'
            type='chevron-left'
            role='previous'
            inverse={true}
            onClick={focusPrevious}
          />
          <IconButton
            className='hidden-phone hidden-tablet'
            type='chevron-right'
            role='next'
            inverse={true}
            onClick={focusNext}
          />
          <IconButton
            type='redo'
            role='refresh'
            inverse={true}
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
