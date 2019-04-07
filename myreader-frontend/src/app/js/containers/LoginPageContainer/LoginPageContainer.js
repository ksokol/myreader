import React from 'react'
import {connect} from 'react-redux'
import {authorizedSelector, loginFormSelector, tryLogin} from '../../store'
import {LoginPage} from '../../pages'

const mapStateToProps = state => ({
  ...loginFormSelector(state),
  ...authorizedSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onLogin: loginData => dispatch(tryLogin(loginData))
})

const LoginPageContainer = props => <LoginPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPageContainer)
