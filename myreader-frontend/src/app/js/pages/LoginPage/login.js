import {useCallback, useReducer} from 'react'
import {api} from '../../api'

function reducer(state, action) {
  switch(action.type) {
  case 'logged_in': {
    return {
      ...state,
      loggedIn: true,
    }
  }
  case 'loading': {
    return {
      ...state,
      pending: true,
      failed: false,
    }
  }
  case 'failed': {
    return {
      ...state,
      failed: true,
    }
  }
  case 'loaded': {
    return {
      ...state,
      pending: false,
    }
  }
  default: {
    return state
  }
  }
}

export function useLogin() {
  const [state, dispatch] = useReducer(reducer, {
    pending: false,
    failed: false,
    loggedIn: false,
  })

  const login = useCallback(async password => {
    dispatch({type: 'loading'})

    try {
      const searchParams = new URLSearchParams()
      searchParams.set('password', password)

      await api.post({
        url: 'check',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: searchParams,
      })

      dispatch({type: 'logged_in'})
    } catch (error) {
      dispatch({type: 'failed', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  return {
    pending: state.pending,
    failed: state.failed,
    loggedIn: state.loggedIn,
    login,
  }
}
