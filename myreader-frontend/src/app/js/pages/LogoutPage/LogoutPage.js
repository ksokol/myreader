import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {loginRoute} from '../../routes'
import {logout, unauthorized} from '../../store'

class LogoutPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedOut: false
    }
  }

  componentDidMount() {
    this.props.dispatch(logout(() => {
      this.setState({loggedOut: true})
      return unauthorized()
    }))
  }

  render() {
    return this.state.loggedOut ? <Redirect to={loginRoute()} /> : null
  }
}

LogoutPage.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default withRouter(
  connect()(LogoutPage)
)

