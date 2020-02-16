import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {authorized, authorizedSelector} from '../../store/security'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  ...authorizedSelector(state)
})

class Provider extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    isAdmin: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    authorized: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  doAuthorize = roles => this.props.dispatch(authorized({roles}))

  render() {
    const {
      isAdmin,
      roles,
      authorized,
      children
    } = this.props

    return (
      <SecurityContext.Provider
        value={{authorized, isAdmin, roles, doAuthorize: this.doAuthorize}}
      >
        {children}
      </SecurityContext.Provider>
    )
  }
}

export const SecurityProvider = connect(
  mapStateToProps
)(Provider)
