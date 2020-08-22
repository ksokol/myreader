import React, {useCallback, useEffect, useState} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {useSecurity} from '../../contexts/security'

export function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false)
  const {doUnAuthorize} = useSecurity()
  const history = useHistory()

  const logout = useCallback(async() => {
    try {
      await authenticationApi.logout()
      doUnAuthorize()
      setLoggedOut(true)
    } catch {
      history.goBack()
      toast('Logout failed', {error: true})
    }
  }, [history, doUnAuthorize])

  useEffect(() => {
    logout()
  }, [logout])

  return loggedOut ? <Redirect to={LOGIN_URL} /> : null
}
