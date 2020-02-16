import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {authorizedSelector, updateSecurity} from '../../store/security'
import {connect} from 'react-redux'
import {setLastSecurityState} from './security'
import {api} from '../../api'

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

  constructor(props) {
    super(props)

    api.addInterceptor(this)
  }

  doAuthorize = roles => {
    setLastSecurityState({roles})
    this.props.dispatch(updateSecurity())
  }

  doUnAuthorize = () => {
    setLastSecurityState({roles: []})
    this.props.dispatch(updateSecurity())
  }

  onError = (request, error) => {
    if (error.status === 401) {
      this.doUnAuthorize()
    }
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
