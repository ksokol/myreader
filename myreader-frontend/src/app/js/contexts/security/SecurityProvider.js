import React, {useState, useEffect, useCallback} from 'react'
import SecurityContext from './SecurityContext'
import {getLastSecurityState, setLastSecurityState} from './security'
import {api} from '../../api'

export function SecurityProvider({children}) {
  const [passwordHash, setPasswordHash] = useState(getLastSecurityState().passwordHash)

  const updateStateAndLocalStorage = (passwordHash) => {
    setLastSecurityState({passwordHash})
    setPasswordHash(passwordHash)
  }

  const doAuthorize = useCallback((passwordHash) => {
    updateStateAndLocalStorage(passwordHash)
  }, [])

  const doUnAuthorize = useCallback(() => {
    updateStateAndLocalStorage(null)
  }, [])

  useEffect(() => {
    const errorInterceptor = {
      onError: (request, error) => {
        if (error.status === 401) {
          doUnAuthorize()
        }
      }
    }
    api.addInterceptor(errorInterceptor)

    const onBeforeInterceptor = {
      onBefore: (request) => {
        if (passwordHash) {
          request.headers = {
            Authorization: `Bearer ${passwordHash}`
          }
        }
      }
    }
    api.addInterceptor(onBeforeInterceptor)

    return () => {
      api.removeInterceptor(errorInterceptor)
      api.removeInterceptor(onBeforeInterceptor)
    }

  }, [doUnAuthorize, passwordHash])

  return (
    <SecurityContext.Provider
      value={{
        authorized: !!passwordHash,
        doAuthorize: doAuthorize,
        doUnAuthorize: doUnAuthorize
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}
