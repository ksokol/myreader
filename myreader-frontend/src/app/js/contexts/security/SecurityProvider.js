import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {authorizedSelector, unauthorized, updateSecurity} from '../../store/security'
import {connect} from 'react-redux'
import {setLastSecurityState} from './security'

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

  doAuthorize = roles => {
    setLastSecurityState({roles})
    this.props.dispatch(updateSecurity())
  }

  doUnAuthorize = () => {
    this.props.dispatch(unauthorized())
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
        value={{
          authorized,
          isAdmin,
          roles,
          doAuthorize: this.doAuthorize,
          doUnAuthorize: this.doUnAuthorize
        }}
      >
        {children}
      </SecurityContext.Provider>
    )
  }
}

export const SecurityProvider = connect(
  mapStateToProps
)(Provider)
