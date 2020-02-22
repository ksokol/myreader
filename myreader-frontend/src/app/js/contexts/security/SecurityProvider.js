import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {getLastSecurityState, setLastSecurityState} from './security'
import {api} from '../../api'
import {ROLE_ADMIN} from '../../constants'

export class SecurityProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = this.deriveStateFromRoles(getLastSecurityState())
  }

  componentDidMount() {
    api.addInterceptor(this)
  }

  componentWillUnmount() {
    api.removeInterceptor(this)
  }

  doAuthorize = roles => this.updateStateAndLocalStorage({roles})

  doUnAuthorize = () => this.updateStateAndLocalStorage({})

  onError = (request, error) => {
    if (error.status === 401) {
      this.doUnAuthorize()
    }
  }

  updateStateAndLocalStorage = ({roles = []}) => {
    setLastSecurityState({roles})
    this.setState(this.deriveStateFromRoles({roles}))
  }

  deriveStateFromRoles = ({roles = []}) => {
    return {
      authorized: roles.length > 0,
      isAdmin: roles.includes(ROLE_ADMIN),
      roles
    }
  }

  render() {
    const {
      children
    } = this.props

    const {
      isAdmin,
      roles,
      authorized
    } = this.state

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
