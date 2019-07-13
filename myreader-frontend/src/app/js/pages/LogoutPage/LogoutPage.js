import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LOGIN_URL} from '../../constants'
import {unauthorized} from '../../store'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {withLocationState} from '../../contexts/locationState/withLocationState'

class LogoutPage extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    historyGoBack: PropTypes.func.isRequired
  }

  state = {
    loggedOut: false
  }

  async componentDidMount() {
    try {
      await authenticationApi.logout()
      this.props.dispatch(unauthorized())
      this.setState({
        loggedOut: true
      })
    } catch {
      this.props.historyGoBack()
      toast('Logout failed', {error: true})
    }
  }

  render() {
    return this.state.loggedOut ? <Redirect to={LOGIN_URL} /> : null
  }
}

export default connect()(
  withLocationState(LogoutPage)
)

