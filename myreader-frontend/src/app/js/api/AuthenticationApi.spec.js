import {AuthenticationApi} from './AuthenticationApi'
import {LOGIN, LOGOUT} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('AuthenticationApi', () => {

  let  authenticationApi

  beforeEach(() => {
    exchange.mockClear()
    authenticationApi = new AuthenticationApi()
  })

  it('should call GET logout endpoint', () => {
    exchange.mockResolvedValueOnce({ok: true})
    authenticationApi.logout()

    expect(exchange).toHaveBeenCalledWith({
      method: 'POST',
      url: LOGOUT
    })
  })

  it('should return expected response when GET logout succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(authenticationApi.logout()).resolves.toBeNull()
  })

  it('should call GET login endpoint', () => {
    exchange.mockResolvedValueOnce({})
    authenticationApi.login('expected username', 'expected password')

    expect(exchange).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: LOGIN,
      'headers': {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }))
    expect(exchange.mock.calls[0][0].body.toString()).toEqual(
      'username=expected+username&password=expected+password'
    )
  })
})
