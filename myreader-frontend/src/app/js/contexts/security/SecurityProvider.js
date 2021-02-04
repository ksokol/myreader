import React from 'react'
import PropTypes from 'prop-types'
import SecurityContext from './SecurityContext'
import {getLastSecurityState, setLastSecurityState} from './security'
import {api} from '../../api'

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

  doAuthorize = () => this.updateStateAndLocalStorage({authorized: true})

  doUnAuthorize = () => this.updateStateAndLocalStorage({authorized: false})

  onError = (request, error) => {
    if (error.status === 401) {
      this.doUnAuthorize()
    }
  }

  updateStateAndLocalStorage = ({authorized}) => {
    setLastSecurityState({authorized})
    this.setState(this.deriveStateFromRoles({authorized}))
  }

  deriveStateFromRoles = ({authorized}) => {
    return {
      authorized,
    }
  }

  render() {
    const {
      children
    } = this.props

    const {
      authorized
    } = this.state

    return (
      <SecurityContext.Provider
        value={{
          authorized,
          doAuthorize: this.doAuthorize,
          doUnAuthorize: this.doUnAuthorize
        }}
      >
        {children}
      </SecurityContext.Provider>
    )
  }
}
