import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {getLastSecurityState, setLastSecurityState} from './security'
import {api} from '../../api'

export function SecurityProvider({children}) {
  const [authorized, setAuthorized] = useState(getLastSecurityState().authorized)

  const updateStateAndLocalStorage = (value) => {
    setLastSecurityState({authorized: value})
    setAuthorized(value)
  }

  const doAuthorize = useCallback(() => {
    updateStateAndLocalStorage(true)
  }, [])

  const doUnAuthorize = useCallback(() => {
    updateStateAndLocalStorage(false)
  }, [])

  useEffect(() => {
    const interceptor = {
      onError: (request, error) => {
        if (error.status === 401) {
          doUnAuthorize()
        }
      }
    }

    api.addInterceptor(interceptor)
    return () => api.removeInterceptor(interceptor)
  }, [doUnAuthorize])

  return (
    <SecurityContext.Provider
      value={{
        authorized,
        doAuthorize: doAuthorize,
        doUnAuthorize: doUnAuthorize
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

SecurityProvider.propTypes = {
  children: PropTypes.any
}
