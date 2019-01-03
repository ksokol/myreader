import {createSelector} from 'reselect'
import {cloneObject} from '../shared/objects'

const securitySelector = state => state.security

export const authorizedSelector = createSelector(
  securitySelector,
  security => security.authorized
)

export const adminPermissionSelector = createSelector(
  securitySelector,
  security => security.role === 'ROLE_ADMIN'
)

export const loginFormSelector = createSelector(
  securitySelector,
  security => cloneObject(security.loginForm)
)
