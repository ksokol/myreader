import {useCallback, useEffect, useReducer} from 'react'
import {entryApi} from '../api'

function reducer(state, action) {
  switch(action.type) {
  case 'add_toggle': {
    return {
      ...state,
      toggle: [...state.toggle, action.uuid],
    }
  }
  case 'remove_toggle': {
    return {
      ...state,
      toggle: state.toggle.filter(it => it !== action.uuid),
    }
  }
  case 'add_flag': {
    return {
      ...state,
      flag: [...state.flag, action.uuid],
    }
  }
  case 'remove_flag': {
    return {
      ...state,
      flag: state.flag.filter(it => it !== action.uuid),
    }
  }
  case 'add_entries': {
    return {
      ...state,
      entries: state.entries.concat(action.entries),
      links: action.links
    }
  }
  case 'update_entry': {
    return {
      ...state,
      entries: state.entries.map(it => it.uuid === action.entry.uuid ? action.entry : it),
    }
  }
  case 'clear_entries': {
    return {
      ...state,
      entries: [],
      links: {}
    }
  }
  case 'loading': {
    return {
      ...state,
      error: null,
      loading: true,
    }
  }
  case 'loaded': {
    return {
      ...state,
      loading: false,
    }
  }
  case 'error': {
    return {
      ...state,
      lastError: action.error,
    }
  }
  default: {
    return state
  }
  }
}

export function useEntries() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    lastError: null,
    toggle: [],
    flag: [],
    entries: [],
    links: {},
  })

  const fetchEntries = useCallback(async link => {
    dispatch({type: 'loading'})

    try {
      const response = await entryApi.fetchEntries(link)
      dispatch({type: 'add_entries', ...response})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const changeEntry = useCallback(async entry => {
    try {
      const oldValue = state.entries.find(it => it.uuid === entry.uuid)
      const newEntry = await entryApi.updateEntry({...entry, context: {oldValue}})
      dispatch({type: 'update_entry', entry: newEntry})
    } catch (error) {
      dispatch({type: 'error', error})
    }
  }, [state.entries])

  useEffect(() => {
    async function run(entry) {
      try {
        const oldValue = state.entries.find(it => it.uuid === entry.uuid)
        const newEntry = await entryApi.updateEntry({...entry, seen: !entry.seen, context: {oldValue}})
        dispatch({type: 'update_entry', entry: newEntry})
      } catch (error) {
        dispatch({type: 'error', error})
      }
    }

    const uuid = state.toggle[0]
    if (uuid) {
      const entry = state.entries.find(it => it.uuid === uuid)
      if (entry) {
        run(entry)
      }
      dispatch({type: 'remove_toggle', uuid})
    }

  }, [state.entries, state.toggle])

  useEffect(() => {
    async function run(entry) {
      try {
        const oldValue = state.entries.find(it => it.uuid === entry.uuid)
        const newEntry = await entryApi.updateEntry({...entry, context: {oldValue}})
        dispatch({type: 'update_entry', entry: newEntry})
      } catch (error) {
        dispatch({type: 'error', error})
      }
    }

    const uuid = state.flag[0]
    if (uuid) {
      const entry = state.entries.find(it => it.uuid === uuid)
      if (entry && !entry.seen) {
        run({...entry, seen: true})
      }
      dispatch({type: 'remove_flag', uuid})
    }
  }, [state.entries, state.flag])

  const setSeenFlag = useCallback(async entryUuid => {
    dispatch({type: 'add_flag', uuid: entryUuid})
  }, [])

  const toggleSeenFlag = useCallback(async entryUuid => {
    dispatch({type: 'add_toggle', uuid: entryUuid})
  }, [dispatch])

  const clearEntries = useCallback(() => {
    dispatch({type: 'clear_entries'})
  }, [])

  return {
    entries: state.entries,
    links: state.links,
    loading: state.loading,
    lastError: state.lastError,
    fetchEntries,
    changeEntry,
    setSeenFlag,
    toggleSeenFlag,
    clearEntries,
  }
}
