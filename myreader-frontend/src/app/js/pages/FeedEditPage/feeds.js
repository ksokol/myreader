import {useCallback, useReducer} from 'react'
import {feedApi} from '../../api'

function reducer(state, action) {
  switch(action.type) {
  case 'set_feed': {
    return {
      ...state,
      feed: action.feed,
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
    lastError: null,
  })

  const loadFeed = useCallback(async uuid => {
    try {
      const feed = await feedApi.fetchFeed(uuid)
      dispatch({type: 'set_feed', feed})
    } catch(error) {
      dispatch({type: 'error', error})
    }
  }, [])

  return {
    feed: state.feed,
    lastError: state.lastError,
    loadFeed,
  }
}
