import './LoginForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../components/Buttons'
import {Input} from '../../components/Input/Input'

export default class LoginForm extends React.Component {

  static propTypes = {
    loginPending: PropTypes.bool,
    loginFailed: PropTypes.bool,
    onLogin: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loginPending: false,
    loginFailed: false
  }

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    const {
      username,
      password
    } = this.state

    const {
      loginPending,
      loginFailed,
      onLogin
    } = this.props

    return (
      <form
        className='my-login-form'
      >
        <Input
          type='email'
          name='username'
          label='Email'
          value={username}
          autoComplete='email'
          onChange={({target: {value}}) => this.setState({username: value})}
          disabled={loginPending}
        />

        <Input
          type='password'
          name='password'
          label='Password'
          value={password}
          autoComplete='current-password'
          onChange={({target: {value}}) => this.setState({password: value})}
          disabled={loginPending}
        />

        <div
          className='my-login-form__message'
        >
          {loginFailed && <span>Username or password wrong</span>}
        </div>

        <Button
          onClick={() => onLogin({username, password})}
          disabled={loginPending}>
          Login
        </Button>
      </form>
    )
  }
}
