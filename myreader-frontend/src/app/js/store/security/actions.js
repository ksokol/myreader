import * as types from '../../store/action-types'
import {getLastSecurityState, setLastSecurityState} from '../../contexts/security/security'

export const updateSecurity = () => {
  const {roles} = getLastSecurityState()
  return {
    type: types.SECURITY_UPDATE,
    authorized: roles.length > 0,
    roles
  }
}

export const unauthorized = () => {
  setLastSecurityState({roles: []})
  return updateSecurity()
}

export const authorized = ({roles}) => {
  setLastSecurityState({roles})
  return updateSecurity()
}
