import React from 'react'
import {withRouter} from 'react-router-dom'
import {loginRoute} from '../../routes'

class Logout extends React.Component {

  componentDidMount() {
    this.props.history.replace(loginRoute())
  }

  render() {
    return null
  }
}

export default withRouter(Logout)
