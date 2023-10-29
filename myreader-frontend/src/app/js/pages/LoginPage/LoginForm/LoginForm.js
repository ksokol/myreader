import './LoginForm.css'
import React, {useState} from 'react'
import {Button} from '../../../components/Buttons'
import {Input} from '../../../components/Input/Input'

export function LoginForm({
  loginPending = false,
  loginFailed = false,
  onLogin
}) {
  const [password, setPassword] = useState('')

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
