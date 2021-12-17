import './LoginPage.css'
import {useEffect} from 'react'
import {LoginForm} from './LoginForm/LoginForm'
import {ENTRIES_PAGE_PATH} from '../../constants'
import {useSecurity} from '../../contexts/security'
import {useLogin} from './login'
import {Redirect} from '../../components/router'

function getAttribute(name) {
  return document.querySelector('head').getAttribute(name)
}

export function LoginPage() {
  const {pending, failed, loggedIn, login} = useLogin()
  const {doAuthorize, authorized} = useSecurity()

  useEffect(() => {
    if (loggedIn) {
      doAuthorize()
    }
  }, [doAuthorize, loggedIn])

  return authorized ? (
    <Redirect
      pathname={ENTRIES_PAGE_PATH}
    />
  ) : (
    <div className='login-page'>
      <LoginForm
        loginPending={pending}
        loginFailed={failed}
        onLogin={password => login(password)}
      />
      <div className='login-page__application-info'>
        <span>{getAttribute('data-build-commit-id')}</span>
        <span>{getAttribute('data-build-version')}</span>
      </div>
    </div>
  )
}
