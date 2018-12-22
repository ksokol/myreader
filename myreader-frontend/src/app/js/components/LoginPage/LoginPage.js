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
      disabled,
      loginError,
      onLogin
    } = this.props

    return (
      <form className='my-login'>
        <Input type='email'
               name='username'
               label='Email'
               value={username}
               autoComplete='email'
               onChange={({target: {value}}) => this.setState({username: value})}
               disabled={disabled} />

        <Input type='password'
               name='password'
               label='Password'
               value={password}
               autoComplete='current-password'
               onChange={({target: {value}}) => this.setState({password: value})}
               disabled={disabled} />

        <div className='my-login__message'>
          {loginError && <span>Username or password wrong</span>}
        </div>

        <Button type='submit'
                onClick={() => onLogin({username, password})}
                disabled={disabled}>Login
        </Button>
      </form>
    )
  }
}

LoginPage.propTypes = {
  disabled: PropTypes.bool,
  loginError: PropTypes.bool,
  onLogin: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
  disabled: false,
  loginError: false
}

export default LoginPage
