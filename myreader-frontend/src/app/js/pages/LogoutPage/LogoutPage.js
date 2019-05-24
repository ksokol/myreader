import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LOGIN_URL} from '../../constants'
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
    return this.state.loggedOut ? <Redirect to={LOGIN_URL} /> : null
  }
}

LogoutPage.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export default connect()(LogoutPage)

