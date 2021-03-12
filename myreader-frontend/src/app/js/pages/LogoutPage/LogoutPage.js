import React, {useEffect, useState} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {LOGIN_PAGE_PATH} from '../../constants'
import {api} from '../../api'
import {toast} from '../../components/Toast'
import {useSecurity} from '../../contexts/security'

export function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false)
  const {doUnAuthorize} = useSecurity()
  const history = useHistory()

  useEffect(() => {
    const logout = async () => {
      try {
        await api.post({
          url: 'logout',
        })
        doUnAuthorize()
        setLoggedOut(true)
      } catch {
        history.goBack()
        toast('Logout failed', {error: true})
      }
    }

    logout()
  }, [doUnAuthorize, history])

  return loggedOut ? <Redirect to={LOGIN_PAGE_PATH} /> : null
}
