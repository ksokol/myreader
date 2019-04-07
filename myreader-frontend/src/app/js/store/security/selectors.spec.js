import {adminPermissionSelector, authorizedSelector, loginFormSelector} from '../../store'

describe('security selectors', () => {

  it('should return authorization state for role USER', () => {
    expect(authorizedSelector({security: {roles: ['USER']}})).toEqual({
      authorized: true,
      isAdmin: false,
      roles: ['USER']
    })
  })

  it('should return authorization state for role ADMIN', () => {
    expect(authorizedSelector({security: {roles: ['ADMIN']}})).toEqual({
      authorized: true,
      isAdmin: true,
      roles: ['ADMIN']
    })
  })

  it('adminPermissionSelector should return false when roles is set to value "user"', () => {
    expect(adminPermissionSelector({security: {roles: ['USER']}})).toEqual(false)
  })

  it('adminPermissionSelector should return true when roles is set to value "admin"', () => {
    expect(adminPermissionSelector({security: {roles: ['ADMIN']}})).toEqual(true)
  })

  it('loginFormSelector should return loginForm', () => {
    const state = {
      security: {
        loginForm: {
          loginPending: true,
          loginFailed: true
        }
      }
    }

    expect(loginFormSelector(state)).toEqual({
      loginPending: true,
      loginFailed: true
    })
  })
})
