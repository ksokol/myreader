import {SubscriptionApi} from './SubscriptionApi'
import {SUBSCRIPTIONS} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('SubscriptionApi', () => {

  let subscriptionApi

  beforeEach(() => {
    exchange.mockClear()
    subscriptionApi = new SubscriptionApi()
  })

  it('should call POST subscriptions endpoint', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionApi.subscribe({a: 'b', c: 'd'})

    expect(exchange).toHaveBeenCalledWith({
      method: 'POST',
      url: `${SUBSCRIPTIONS}`,
      body: {
        a: 'b',
        c: 'd'
      }
    })
  })

  it('should return expected response when POST subscription succeeded', async () => {
    exchange.mockResolvedValueOnce({a: 'b', c: 'd'})

    await expect(subscriptionApi.subscribe({})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })

  it('should call GET subscriptions endpoint', () => {
    exchange.mockResolvedValueOnce({content: []})
    subscriptionApi.fetchSubscriptions()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}`
    })
  })

  it('should return expected response when GET subscriptions succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {uuid: '1', tag: null},
        {uuid: '2', tag: 'tag2'}
      ]
    })

    await expect(subscriptionApi.fetchSubscriptions()).resolves.toEqual([
      {uuid: '1', tag: null},
      {uuid: '2', tag: 'tag2'}
    ])
  })
})
