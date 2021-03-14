import {useCallback, useState} from 'react'
import {api} from '../../../api'

export function useEntryTags() {
  const [state, setState] = useState({
    fetched: false,
    error: null,
    entryTags: [],
  })

  const fetchEntryTags = useCallback(async () => {
    try {
      const entryTags = await api.get({
        url: 'api/2/subscriptionEntries/availableTags',
      })
      setState(current => ({...current, entryTags}))
    } catch (error) {
      setState(current => ({...current, error}))
    }
  }, [])

  return {
    entryTags: state.entryTags,
    fetched: state.fetched,
    error: state.error,
    fetchEntryTags,
  }
}
