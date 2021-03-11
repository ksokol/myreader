import {AuthenticationApi} from './AuthenticationApi'
import {LOGOUT} from '../constants'
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
})
