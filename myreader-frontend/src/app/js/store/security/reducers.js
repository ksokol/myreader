import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

export function securityReducers(state = initialApplicationState().security, action) {
  switch (action.type) {
  case types.SECURITY_UPDATE: {
    const {authorized, role} = action
    return {
      ...state,
      authorized,
      role,
      loginForm: {
        ...state.loginForm,
        loginFailed: !state.authorized && !authorized
      }
    }
  }
  case types.LOGIN_START: {
    return {
      ...state,
      loginForm: {
        ...state.loginForm,
        loginPending: true,
        loginFailed: false
      }
    }
  }
  case types.LOGIN_END: {
    return {
      ...state,
      loginForm: {
        ...state.loginForm,
        loginPending: false
      }
    }
  }
  default: {
    return state
  }
  }
}
