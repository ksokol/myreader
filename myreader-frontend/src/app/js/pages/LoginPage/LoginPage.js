import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {LoginForm} from '../../components'
import {entriesRoute} from '../../routes'

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

export default LoginPage
