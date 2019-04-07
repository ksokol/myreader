import React from 'react'
import PropTypes from 'prop-types'
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

Logout.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(Logout)
