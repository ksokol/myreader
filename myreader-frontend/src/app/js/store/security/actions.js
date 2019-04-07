import * as types from '../../store/action-types'
import {getLastSecurityState, setLastSecurityState} from './security'
import {LOGIN, LOGOUT, ROLE_ADMIN} from '../../constants'
import {routeChange} from '../../store'
import {adminOverviewRoute, entriesRoute} from '../../routes'

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

export const logout = () => {
  return {
    type: 'POST_LOGOUT',
    url: LOGOUT,
    success: unauthorized
  }
}

const loginStart = () => {
  return {
    type: types.LOGIN_START
  }
}

const loginEnd = () => {
  return {
    type: types.LOGIN_END
  }
}

export const tryLogin = ({username, password}) => {
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
    before: loginStart,
    success: (response, headers) => {
      const roles = headers['x-my-authorities'].split(',')
      return [
        authorized({roles}),
        roles.includes(ROLE_ADMIN) ? routeChange(adminOverviewRoute()) : routeChange(entriesRoute())
      ]
    },
    finalize: loginEnd
  }
}
