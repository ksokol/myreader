import './LoginPage.css'
import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {LoginForm} from '../../components'
import {ENTRIES_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {useSecurity} from '../../contexts/security'

function getAttribute(name) {
  return document.querySelector('head').getAttribute(name)
}

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

  const onLogin = async password => {
    setState({
      loginPending: true,
      loginFailed: false
    })

    try {
      await authenticationApi.login(password)
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
    <div className='login-page'>
      <LoginForm
        loginPending={loginPending}
        loginFailed={loginFailed}
        onLogin={onLogin}
      />
      <div className='login-page__application-info'>
        <span>{getAttribute('data-build-commit-id')}</span>
        <span>{getAttribute('data-build-version')}</span>
      </div>
    </div>
  )
}
