import {useCallback, useReducer} from 'react'
import {feedApi} from '../../api'

function reducer(state, action) {
  switch(action.type) {
  case 'set_feed': {
    return {
      ...state,
      updated: false,
      feed: action.feed,
    }
  }
  case 'update_feed': {
    return {
      ...state,
      updated: true,
      feed: action.feed,
    }
  }
  case 'delete_feed': {
    return {
      ...state,
      updated: false,
      deleted: true,
      feed: null,
    }
  }
  case 'loading': {
    return {
      ...state,
      updated: false,
      error: null,
      validations: [],
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
    const error = action.error
    if (error.status === 400) {
      return error.data && Array.isArray(error.data.errors) ? {
        ...state,
        lastError: null,
        validations: error.data.errors,
      } : {
        ...state,
        lastError: error,
        validations: [],
      }
    } else if (error.status === 409) {
      return  {
        ...state,
        lastError: {
          data: 'Can not delete. Feed has subscriptions'
        }
      }
    } else {
      return {
        ...state,
        lastError: error,
      }
    }
  }
  default: {
    return state
  }
  }
}

export function useFeed() {
  const [state, dispatch] = useReducer(reducer, {
    feed: null,
    validations: [],
    updated: false,
    deleted: false,
    loading: false,
    lastError: null,
  })

  const loadFeed = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      const feed = await feedApi.fetchFeed(uuid)
      dispatch({type: 'set_feed', feed})
    } catch(error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const saveFeed = useCallback(async feed => {
    dispatch({type: 'loading'})

    try {
      const saved = await feedApi.saveFeed(feed)
      dispatch({type: 'update_feed', feed: saved})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const deleteFeed = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      await feedApi.deleteFeed(uuid)
      dispatch({type: 'delete_feed'})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  return {
    feed: state.feed,
    loading: state.loading,
    updated: state.updated,
    deleted: state.deleted,
    lastError: state.lastError,
    validations: state.validations,
    loadFeed,
    saveFeed,
    deleteFeed,
  }
}
