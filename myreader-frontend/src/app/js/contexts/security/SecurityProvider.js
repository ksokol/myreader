import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {authorizedSelector} from '../../store/security'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  ...authorizedSelector(state)
})

class Provider extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    isAdmin: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    authorized: PropTypes.bool.isRequired
  }

  render() {
    const {
      isAdmin,
      roles,
      authorized,
      children
    } = this.props

    return (
      <SecurityContext.Provider
        value={{authorized, isAdmin, roles}}
      >
        {children}
      </SecurityContext.Provider>
    )
  }
}

export const SecurityProvider = connect(
  mapStateToProps
)(Provider)
