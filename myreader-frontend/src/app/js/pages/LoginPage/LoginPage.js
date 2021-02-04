import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {LoginForm} from '../../components'
import {ENTRIES_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {useSecurity} from '../../contexts/security'

export function LoginPage() {
  const [{loginPending, loginFailed}, setState] = useState({
    loginPending: false,
    loginFailed: false
  })
  const {doAuthorize, authorized} = useSecurity()

  const onSuccess = () => {
    setState({
      loginPending: false,
      loginFailed: false
    })

    doAuthorize()
  }

  const onLogin = async ({username, password}) => {
    setState({
      loginPending: true,
      loginFailed: false
    })

    try {
      await authenticationApi.login(username, password)
      setState({
        loginPending: false,
      })
      onSuccess()
    } catch {
      setState({
        loginFailed: true,
        loginPending: false,
      })
    }
  }

  return authorized ? (
    <Redirect
      to={ENTRIES_URL}
    />
  ) : (
    <LoginForm
      loginPending={loginPending}
      loginFailed={loginFailed}
      onLogin={onLogin}
    />
  )
}
