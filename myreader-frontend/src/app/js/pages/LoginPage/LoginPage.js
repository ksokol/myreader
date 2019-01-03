import './LoginPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, Input} from '../../components'

class LoginPage extends React.Component {

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
      <form className='my-login-page'>
        <Input type='email'
               name='username'
               label='Email'
               value={username}
               autoComplete='email'
               onChange={({target: {value}}) => this.setState({username: value})}
               disabled={loginPending}
        />

        <Input type='password'
               name='password'
               label='Password'
               value={password}
               autoComplete='current-password'
               onChange={({target: {value}}) => this.setState({password: value})}
               disabled={loginPending}
        />

        <div className='my-login-page__message'>
          {loginFailed && <span>Username or password wrong</span>}
        </div>

        <Button type='submit'
                onClick={() => onLogin({username, password})}
                disabled={loginPending}>Login
        </Button>
      </form>
    )
  }
}

LoginPage.propTypes = {
  loginPending: PropTypes.bool,
  loginFailed: PropTypes.bool,
  onLogin: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  loginPending: false,
  loginFailed: false
}

export default LoginPage
