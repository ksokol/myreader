import React from 'react'
import PropTypes from 'prop-types'
import {ReactReduxContext} from 'react-redux'
import {routeChange} from '../../store/router'

export class Redirect extends React.Component {

  static contextType = ReactReduxContext

  componentDidMount() {
    this.context.store.dispatch(routeChange(this.props.to))
  }

  render() {
    return null
  }
}

Redirect.propTypes = {
  to: PropTypes.object.isRequired
}
