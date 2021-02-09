import {SubscriptionApi} from './SubscriptionApi'
import {FEEDS, SUBSCRIPTIONS} from '../constants'
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

  it('should call DELETE subscription endpoint for uuid1', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionApi.deleteSubscription('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${SUBSCRIPTIONS}/uuid1`,
    })
  })

  it('should return expected response when DELETE subscription for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(subscriptionApi.deleteSubscription()).resolves.toBeNull()
  })

  it('should call PATCH subscriptions endpoint for uuid1', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionApi.saveSubscription({uuid: 'uuid1', a: 'b', c: 'd', feedTag: {}})

    expect(exchange).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${SUBSCRIPTIONS}/uuid1`,
      body: {
        uuid: 'uuid1',
        a: 'b',
        c: 'd',
        feedTag: null
      }
    })
  })

  it('should call PATCH subscription endpoint for uuid1 with feedTag set', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionApi.saveSubscription({uuid: 'uuid1', feedTag: {name: 'expected name'}})

    expect(exchange).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${SUBSCRIPTIONS}/uuid1`,
      body: {
        uuid: 'uuid1',
        feedTag: {
          name: 'expected name'
        }
      }
    })
  })

  it('should return expected response when PATCH subscription for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(subscriptionApi.saveSubscription({})).resolves.toBeNull()
  })

  it('should call GET subscriptions endpoint for uuid1', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionApi.fetchSubscription('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}/uuid1`
    })
  })

  it('should return expected response when GET subscription for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce({a: 'b', c: 'd'})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      a: 'b',
      c: 'd',
      feedTag: {
        uuid: undefined,
        name: undefined,
        color: undefined
      }
    })
  })

  it('should return expected response with feedTag null when GET subscription for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce({feedTag: null})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: undefined,
        name: undefined,
        color: undefined
      }
    })
  })

  it('should return expected response with feedTag when GET subscription for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce({feedTag: {uuid: 'uuid1', name: 'name1', color: 'color1'}})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: 'uuid1',
        name: 'name1',
        color: 'color1'
      }
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
        {uuid: '1'},
        {uuid: '2', feedTag: {uuid: '2'}}
      ]
    })

    await expect(subscriptionApi.fetchSubscriptions()).resolves.toEqual([
      {uuid: '1', feedTag: {}},
      {uuid: '2', feedTag: {uuid: '2'}}
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
