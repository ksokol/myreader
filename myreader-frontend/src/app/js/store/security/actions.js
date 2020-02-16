import * as types from '../../store/action-types'
import {getLastSecurityState} from '../../contexts/security/security'

export const updateSecurity = () => {
  const {roles} = getLastSecurityState()
  return {
    type: types.SECURITY_UPDATE,
    authorized: roles.length > 0,
    roles
  }
}
