import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {withAppContext} from '../../contexts'

class LogoutPage extends React.Component {

  static propTypes = {
    doUnAuthorize: PropTypes.func.isRequired,
    historyGoBack: PropTypes.func.isRequired
  }

  state = {
    loggedOut: false
  }

  async componentDidMount() {
    try {
      await authenticationApi.logout()
      this.props.doUnAuthorize()
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

export default withAppContext(withLocationState(LogoutPage))

