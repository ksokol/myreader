import {useReducer, useCallback} from 'react'

function reducer(state, action) {
  switch(action.type) {
  case 'next': {
    if (state.focusIndex + 2 > state.entries.length) {
      return state
    }

    return  {
      ...state,
      focusIndex: Math.min(state.focusIndex + 1, state.entries.length),
    }
  }
  case 'previous': {
    if (state.focusIndex === -1) {
      return state
    }

    return {
      ...state,
      focusIndex: Math.max(state.focusIndex - 1 , -1),
    }
  }

  case 'entries': {
    return {
      ...state,
      focusIndex: action.entries.length === 0 ? -1 : state.focusIndex,
      entries: action.entries.map(it => it.uuid),
    }
  } default: {
    return state
  }
  }
}

export function useAutofocusEntry() {
  const [state, dispatch] = useReducer(reducer, {
    entries: [],
    focusIndex: -1,
  })

  const setEntries = useCallback(entries => {
    dispatch({type: 'entries', entries})
  }, [dispatch])

  const focusNext = useCallback(() => {
    dispatch({type: 'next'})
  }, [dispatch])

  const focusPrevious = useCallback(() => {
    dispatch({type: 'previous'})
  }, [dispatch])

  return {
    entryInFocusUuid: state.entries[state.focusIndex],
    setEntries,
    focusNext,
    focusPrevious,
  }
}
