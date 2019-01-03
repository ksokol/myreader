import {adminPermissionSelector, authorizedSelector, loginFormSelector} from '../../store'

describe('security selectors', () => {

  it('should return false for authorized flag from state', () => {
    expect(authorizedSelector({security: {authorized: false}})).toEqual(false)
  })

  it('should return true for authorized flag from state', () => {
    expect(authorizedSelector({security: {authorized: true}})).toEqual(true)
  })

  it('adminPermissionSelector should return false when role is set to value "user"', () => {
    expect(adminPermissionSelector({security: {role: 'ROLE_USER'}})).toEqual(false)
  })

  it('adminPermissionSelector should return true when role is set to value "admin"', () => {
    expect(adminPermissionSelector({security: {role: 'ROLE_ADMIN'}})).toEqual(true)
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
