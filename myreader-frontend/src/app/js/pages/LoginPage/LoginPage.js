import {useEffect} from 'react'
import {LoginForm} from './LoginForm'
import {ENTRIES_PAGE_PATH} from '../../constants'
import {useSecurity} from '../../contexts/security'
import {useLogin} from './login'
import {Redirect} from '../../components/router'

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
    </div>
  )
}
