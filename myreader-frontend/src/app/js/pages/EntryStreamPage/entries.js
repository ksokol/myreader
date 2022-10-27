import {useCallback, useEffect, useReducer} from 'react'
import {api} from '../../api'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

function reducer(state, action) {
  switch(action.type) {
  case 'add_entries': {
    return {
      ...state,
      entries: [...state.entries, ...action.entries],
      nextPage: action.nextPage,
      loadNextPage: false,
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
      nextPage: null
    }
  }
  case 'load_next_page': {
    return {
      ...state,
      loadNextPage: true,
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
    entries: [],
    nextPage: null,
    loadNextPage: false,
  })

  const fetchEntries = useCallback(async query => {
    dispatch({type: 'loading'})

    try {
      const queryParams = new URLSearchParams()
      for (const [key, value] of Object.entries(query || {})) {
        if (value !== undefined && value !== null) {
          queryParams.set(key, value)
        }
      }

      const response = await api.get({
        url: `${SUBSCRIPTION_ENTRIES}?${queryParams}`,
      }).then(raw => ({
        entries: raw.content,
        nextPage: raw.nextPage,
      }))
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
      const newEntry = await api.patch({
        url: `${SUBSCRIPTION_ENTRIES}/${entry.uuid}`,
        body: {seen: entry.seen},
        context: {oldValue}
      })
      dispatch({type: 'update_entry', entry: newEntry})
    } catch (error) {
      dispatch({type: 'error', error})
    }
  }, [state.entries])

  const clearEntries = useCallback(() => {
    dispatch({type: 'clear_entries'})
  }, [])

  const loadNextPage = useCallback(() => {
    dispatch({type: 'load_next_page'})
  }, [])

  useEffect(() => {
    if (state.loadNextPage) {
      fetchEntries(state.nextPage)
    }
  }, [fetchEntries, state.loadNextPage, state.nextPage])

  return {
    entries: state.entries,
    hasNextPage: !!state.nextPage,
    loading: state.loading,
    lastError: state.lastError,
    fetchEntries,
    changeEntry,
    clearEntries,
    loadNextPage,
  }
}
