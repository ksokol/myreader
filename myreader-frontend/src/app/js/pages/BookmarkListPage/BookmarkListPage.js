import React, {useEffect, useMemo} from 'react'
import {EntryList} from '../../components/EntryList/EntryList'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {toast} from '../../components/Toast'
import IconButton from '../../components/Buttons/IconButton/IconButton'
import {useSearchParams} from '../../hooks/router'
import {useEntries} from '../../hooks/entries'
import {useSubscriptions} from '../../hooks/subscriptions'

export function BookmarkListPage() {
  const searchParams = useSearchParams()

  const query = useMemo(() => {
    const seenEqual = searchParams.entryTagEqual ? undefined : true
    const entryTagEqual = searchParams.entryTagEqual ? searchParams.entryTagEqual : ''
    return {...searchParams, seenEqual, entryTagEqual}
  }, [searchParams])

  const {
    entries,
    links,
    loading,
    lastError,
    fetchEntries,
    changeEntry,
    clearEntries,
  } = useEntries()

  const {
    fetchSubscriptions
  } = useSubscriptions()

  const refresh = () => {
    if (!loading) {
      clearEntries()
      fetchEntries({query})
      fetchSubscriptions()
    }
  }

  useEffect(() => {
    fetchEntries({query})
  }, [fetchEntries, query])

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
        <IconButton
          type='redo'
          role='refresh'
          inverse={true}
          onClick={refresh}
        />
      }
      listPanel={
        <EntryList
          entries={entries}
          links={links}
          loading={loading}
          onChangeEntry={changeEntry}
          onLoadMore={fetchEntries}
        />
      }
    />
  )
}
