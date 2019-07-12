import {AuthenticationApi} from './AuthenticationApi'
import {LOGIN, LOGOUT} from '../constants'

const expectedError = 'expected error'

describe('AuthenticationApi', () => {

  let api, authenticationApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    authenticationApi = new AuthenticationApi(api)
  })

  it(`should call GET ${LOGOUT} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true})
    authenticationApi.logout()

    expect(api.request).toHaveBeenCalledWith({
      method: 'POST',
      url: LOGOUT
    })
  })

  it(`should return expected response when GET ${LOGOUT} succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(authenticationApi.logout()).resolves.toBeUndefined()
  })

  it(`should return expected error response when GET ${LOGOUT} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(authenticationApi.logout()).rejects.toEqual(expectedError)
  })

  it(`should call GET ${LOGIN} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, status: 200, headers: {}})
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

  it(`should return expected response when GET ${LOGIN} succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: {'x-my-authorities': 'ROLE1,ROLE2'}
    })

    await expect(authenticationApi.login()).resolves.toEqual(['ROLE1', 'ROLE2'])
  })

  it(`should return expected response when GET ${LOGIN} succeeded without any roles attached`, async () => {
    api.request = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers: {}
    })

    await expect(authenticationApi.login()).resolves.toEqual([''])
  })

  it(`should return expected error response when GET ${LOGIN} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true, status: 400})

    await expect(authenticationApi.login()).rejects.toBeUndefined()
  })
})
