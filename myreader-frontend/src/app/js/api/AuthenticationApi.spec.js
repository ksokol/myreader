import {AuthenticationApi} from './AuthenticationApi'
import {LOGIN, LOGOUT} from '../constants'

describe('AuthenticationApi', () => {

  let api, authenticationApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    authenticationApi = new AuthenticationApi(api)
  })

  it('should call GET logout endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({ok: true})
    authenticationApi.logout()

    expect(api.request).toHaveBeenCalledWith({
      method: 'POST',
      url: LOGOUT
    })
  })

  it('should return expected response when GET logout succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(authenticationApi.logout()).resolves.toBeNull()
  })

  it('should call GET login endpoint', () => {
    authenticationApi.login('expected username', 'expected password')

    expect(api.request).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: LOGIN,
      'headers': {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }))
    expect(api.request.mock.calls[0][0].body.toString()).toEqual(
      'username=expected+username&password=expected+password'
    )
  })

  it('should return expected response when GET login succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce({
      roles: ['ROLE1', 'ROLE2']
    })

    await expect(authenticationApi.login()).resolves.toEqual({
      roles: ['ROLE1', 'ROLE2']
    })
  })

  it('should return expected response when GET login succeeded without any roles attached', async () => {
    api.request = jest.fn().mockResolvedValueOnce({
      roles: []
    })

    await expect(authenticationApi.login()).resolves.toEqual({roles: []})
  })
})
