import './LoginPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {Button, Input} from '../../components'
import {entriesRoute} from '../../routes'

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
      authorized,
      onLogin
    } = this.props

    return authorized ? (
        <Redirect to={entriesRoute()} />
      ) : (
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
  authorized: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  loginPending: false,
  loginFailed: false
}

export default LoginPage
