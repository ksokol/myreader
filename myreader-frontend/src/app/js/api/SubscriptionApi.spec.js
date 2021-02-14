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

  it('should GET feed errors for uuid1 with proper url derived from uuid', () => {
    exchange.mockResolvedValueOnce({content: []})
    subscriptionApi.fetchFeedFetchErrors('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}/uuid1/fetchError`
    })
  })

  it('should GET feed errors for uuid1 with proper url derived from object', () => {
    exchange.mockResolvedValueOnce({content: []})
    subscriptionApi.fetchFeedFetchErrors({path: `${SUBSCRIPTIONS}/uuid2/fetchError`})

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}/uuid2/fetchError`
    })
  })

  it('should return expected response when GET feeds error for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'},
      ],
      links: [
        {rel: 'self', href: 'self href?a=b'},
        {rel: 'next', href: 'next href'}
      ]
    })

    await expect(subscriptionApi.fetchFeedFetchErrors('uuid1')).resolves.toEqual({
      links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
      failures: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'}
      ]
    })
  })
})
