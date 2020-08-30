import {useCallback, useEffect, useState} from 'react'
import {entryApi} from '../api'
import {toast} from '../components/Toast'

export function useEntries() {
  const [{entries, links}, setState] = useState({
    entries: [],
    links: {},
  })

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)

  const fetchEntries = useCallback(async link => {
    setLoading(true)

    try {
      setResponse(await entryApi.fetchEntries(link))
    } catch (error) {
      toast(error.data, {error: true})
    } finally {
      setLoading(false)
    }
  }, [])

  const changeEntry = useCallback(async entry => {
    try {
      const oldValue = entries.find(it => it.uuid === entry.uuid)
      const newEntry = await entryApi.updateEntry({...entry, context: {oldValue}})

      setState({
        entries: entries.map(it => it.uuid === newEntry.uuid ? newEntry : it),
        links
      })
    } catch (error) {
      toast(error.data, {error: true})
    }
  }, [entries, links])

  const clearEntries = useCallback(() => {
    setState({
      entries: [],
      links: {},
    })
  }, [])

  useEffect(() => {
    if (response) {
      setState({
        entries: entries.concat(response.entries),
        links: response.links,
      })
      setResponse(null)
    }
  }, [entries, response])

  return {
    entries,
    links,
    loading,
    fetchEntries,
    changeEntry,
    clearEntries,
  }
}
