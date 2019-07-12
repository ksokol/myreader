import {AuthenticationApi} from './AuthenticationApi'
import {LOGOUT} from '../constants'

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
})
