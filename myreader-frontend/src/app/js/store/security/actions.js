import * as types from '../../store/action-types'
import {getLastSecurityState, setLastSecurityState} from './security'
import {LOGIN, LOGOUT} from '../../constants'

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

export const logout = finalize => {
  return {
    type: 'POST_LOGOUT',
    url: LOGOUT,
    finalize
  }
}

export const tryLogin = ({username, password, success, finalize}) => {
  const searchParams = new URLSearchParams()
  searchParams.set('username', username)
  searchParams.set('password', password)

  return {
    type: 'POST_LOGIN',
    url: LOGIN,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: searchParams,
    success,
    finalize
  }
}
