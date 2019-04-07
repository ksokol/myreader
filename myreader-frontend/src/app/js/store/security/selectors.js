import {cloneObject} from '../shared/objects'
import {ROLE_ADMIN} from '../../constants'

export const authorizedSelector = ({security}) => ({
  authorized: security.roles.length > 0,
  isAdmin: security.roles.includes(ROLE_ADMIN),
  roles: [...security.roles]
})

export const adminPermissionSelector = ({security}) => security.roles.includes(ROLE_ADMIN)

export const loginFormSelector = ({security}) => ({
  ...cloneObject(security.loginForm)
})
