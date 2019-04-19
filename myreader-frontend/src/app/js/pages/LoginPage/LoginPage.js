import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LoginForm} from '../../components'
import {entriesRoute} from '../../routes'
import {authorized, authorizedSelector, routeChange, tryLogin} from '../../store'

const mapStateToProps = state => ({
  ...authorizedSelector(state)
})

class LoginPage extends React.Component {

  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      loginPending: false,
      loginFailed: false
    }
  }

  onLogin = ({username, password}) => {
    this.setState({
      loginPending: true,
      loginFailed: false
    })

    this.props.dispatch(tryLogin({
      username,
      password,
      success: this.onSuccess,
      finalize: this.onFinalize
    }))
  }

  onSuccess = (response, headers) => {
    this.setState({
      loginPending: false,
      loginFailed: false
    })

    const roles = headers['x-my-authorities'].split(',')
    return [
      authorized({roles}),
      routeChange(entriesRoute())
    ]
  }

  onFinalize = (data, headers, status) => {
    this.setState({
      loginPending: false,
      loginFailed: status === 401
    })
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
        to={entriesRoute()}
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

export default connect(
  mapStateToProps
)(LoginPage)
