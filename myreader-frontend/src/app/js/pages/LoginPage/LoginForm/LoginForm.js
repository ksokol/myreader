import './LoginForm.css'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../../components/Buttons'
import {Input} from '../../../components/Input/Input'

export function LoginForm(props) {
  const [password, setPassword] = useState('')

  const {
    loginPending,
    loginFailed,
    onLogin
  } = props

  return (
    <form
      className='my-login-form'
      onSubmit={(event) => {
        event.preventDefault()
        onLogin(password)
      }}
    >
      <Input
        type='password'
        name='password'
        label='Password'
        value={password}
        autoComplete='current-password'
        onChange={({target: {value}}) => setPassword(value)}
        disabled={loginPending}
      />

      <div
        className='my-login-form__message'
      >
        {loginFailed && <span>password wrong</span>}
      </div>

      <Button
        type='submit'
        disabled={loginPending}>
          Login
      </Button>
    </form>
  )
}

LoginForm.propTypes = {
  loginPending: PropTypes.bool,
  loginFailed: PropTypes.bool,
  onLogin: PropTypes.func.isRequired,
}

LoginForm.defaultProps = {
  loginPending: false,
  loginFailed: false
}
