import {useCallback, useReducer} from 'react'
import {api} from '../../api'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

async function sha512(str) {
  return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
    return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
  });
}

function reducer(state, action) {
  switch(action.type) {
  case 'logged_in': {
    return {
      ...state,
      loggedIn: true,
      passwordHash: action.passwordHash,
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
    passwordHash: null,
  })

  const login = useCallback(async password => {
    dispatch({type: 'loading'})

    try {
      const passwordHash = await sha512(password)
      await api.get({
        url: `${SUBSCRIPTION_ENTRIES}?feedTagEqual=`,
        headers: {
          'Authorization': `Bearer ${passwordHash}`
        }
      })

      dispatch({type: 'logged_in', passwordHash})
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
    passwordHash: state.passwordHash,
    login,
  }
}
