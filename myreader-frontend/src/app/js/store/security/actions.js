import * as types from '../../store/action-types'
import {getLastSecurityState, setLastSecurityState} from './security'
import {LOGIN, LOGOUT} from '../../constants'
import {routeChange} from '../../store'
import {adminOverviewRoute, entriesRoute, loginRoute} from '../../../../routes'

export const updateSecurity = () => {
  const {authorized, role} = getLastSecurityState()
  return {
    type: types.SECURITY_UPDATE,
    authorized,
    role
  }
}

export const unauthorized = () => {
  setLastSecurityState({authorized: false, role: ''})
  return [
    updateSecurity(),
    routeChange(loginRoute())
  ]
}

export const authorized = ({role}) => {
  setLastSecurityState({authorized: true, role})
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
      const role = headers['x-my-authorities']
      return [
        authorized({role}),
        role === 'ROLE_ADMIN' ? routeChange(adminOverviewRoute()) : routeChange(entriesRoute())
      ]
    },
    finalize: loginEnd
  }
}
