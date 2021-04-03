import {useEffect, useState, useMemo} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {IconButton} from '../../components/Buttons'
import {useAutofocusEntry} from './useAutofocusEntry'
import {useSettings} from '../../contexts/settings'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {useSearchParams} from '../../hooks/router'
import {EntryList} from './EntryList/EntryList'
import {useEntries} from './entries'
import {toast} from '../../components/Toast'
import {useSubscriptions} from '../../hooks/subscriptions'

export function EntryStreamPage() {
  const {showUnseenEntries} = useSettings()
  const searchParams = useSearchParams()
  const [showingUnseenEntries, setShowingUnseenEntries] = useState(showUnseenEntries)

  const query = useMemo(() => {
    const params = {...searchParams}
    if (searchParams.seenEqual === '*') {
      params.seenEqual = undefined
    } else {
      const showAll = showUnseenEntries === true ? false : undefined
      params.seenEqual = searchParams.seenEqual === undefined ? showAll : searchParams.seenEqual
    }

    return params
  }, [searchParams, showUnseenEntries])

  const {
    entries,
    nextPage,
    loading,
    lastError,
    fetchEntries,
    changeEntry,
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
      fetchEntries(query)
      fetchSubscriptions()
    }
  }

  useHotkeys('right', () => {
    focusNext()
  })

  useHotkeys('left' ,() => {
    focusPrevious()
  })

  useEffect(() => {
    fetchEntries(query)
  }, [fetchEntries, query])

  useEffect(() => {
    setEntries(entries)
  }, [entries, setEntries])

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
          nextPage={nextPage}
          loading={loading}
          entryInFocusUuid={entryInFocusUuid}
          onChangeEntry={changeEntry}
          onLoadMore={fetchEntries}
        />
      }
    />
  )
}
