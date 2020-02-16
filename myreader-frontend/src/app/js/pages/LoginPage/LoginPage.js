import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {LoginForm} from '../../components'
import {ENTRIES_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {withAppContext} from '../../contexts'

class LoginPage extends React.Component {

  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    doAuthorize: PropTypes.func.isRequired
  }

  state = {
    loginPending: false,
    loginFailed: false
  }

  onLogin = async ({username, password}) => {
    this.setState({
      loginPending: true,
      loginFailed: false
    })

    try {
      const {roles} = await authenticationApi.login(username, password)
      this.onSuccess(roles)
    } catch {
      this.setState({
        loginFailed: true
      })
    } finally {
      this.setState({
        loginPending: false
      })
    }
  }

  onSuccess = roles => {
    this.setState({
      loginPending: false,
      loginFailed: false
    })

    this.props.doAuthorize(roles)
  }

  render() {
    const {
      authorized
    } = this.props

    const {
      loginPending,
      loginFailed
    } = this.state

    return authorized ? (
      <Redirect
        to={ENTRIES_URL}
      />
    ) : (
      <LoginForm
        loginPending={loginPending}
        loginFailed={loginFailed}
        onLogin={this.onLogin}
      />
    )
  }
}

export default withAppContext(LoginPage)
