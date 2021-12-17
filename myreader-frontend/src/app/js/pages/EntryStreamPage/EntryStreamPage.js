import {useEffect, useState, useMemo} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import {IconButton} from '../../components/Buttons'
import {useAutofocusEntry} from './useAutofocusEntry'
import {useSettings} from '../../contexts/settings'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {EntryList} from './EntryList/EntryList'
import {useEntries} from './entries'
import {toast} from '../../components/Toast'
import {useNavigation} from '../../hooks/navigation'
import {useRouter} from '../../contexts/router'

export function EntryStreamPage() {
  const {showUnseenEntries} = useSettings()
  const {route} = useRouter()
  const [showingUnseenEntries, setShowingUnseenEntries] = useState(showUnseenEntries)

  const query = useMemo(() => {
    const params = {...route.searchParams}
    if (route.searchParams.seenEqual === '*') {
      params.seenEqual = undefined
    } else {
      const showAll = showUnseenEntries === true ? false : undefined
      params.seenEqual = route.searchParams.seenEqual === undefined ? showAll : route.searchParams.seenEqual
    }

    return params
  }, [route.searchParams, showUnseenEntries])

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
    fetchData
  } = useNavigation()

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
      fetchData()
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
  }, [clearEntries, route.searchParams])

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
