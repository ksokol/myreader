import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LoginForm} from '../../components'
import {entriesRoute} from '../../routes'
import {authorizedSelector, loginFormSelector, tryLogin} from '../../store'

const mapStateToProps = state => ({
  ...loginFormSelector(state),
  ...authorizedSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onLogin: loginData => dispatch(tryLogin(loginData))
})

class LoginPage extends React.Component {

  static propTypes = {
    authorized: PropTypes.bool.isRequired
  }

  render() {
    const {
      authorized,
      ...formProps
    } = this.props

    return authorized ? (
      <Redirect
        to={entriesRoute()}
      />
    ) : (
      <LoginForm
        {...formProps}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
