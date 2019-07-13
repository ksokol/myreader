import {SubscriptionApi} from './SubscriptionApi'
import {SUBSCRIPTIONS} from '../constants'

describe('SubscriptionApi', () => {

  let api, subscriptionApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    subscriptionApi = new SubscriptionApi(api)
  })

  it('should call POST subscriptions endpoint', () => {
    subscriptionApi.subscribe({a: 'b', c: 'd'})

    expect(api.request).toHaveBeenCalledWith({
      method: 'POST',
      url: `${SUBSCRIPTIONS}`,
      body: {
        a: 'b',
        c: 'd'
      }
    })
  })

  it('should return expected response when POST subscription succeeded', async () => {
    const data = {a: 'b', c: 'd'}

    api.request = jest.fn().mockResolvedValueOnce({...data})

    await expect(subscriptionApi.subscribe({})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })

  it('should call DELETE subscription endpoint for uuid1', () => {
    subscriptionApi.deleteSubscription('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${SUBSCRIPTIONS}/uuid1`,
    })
  })

  it('should return expected response when DELETE subscription for uuid1 succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(subscriptionApi.deleteSubscription()).resolves.toBeNull()
  })

  it('should call PATCH subscriptions endpoint for uuid1', () => {
    subscriptionApi.saveSubscription({uuid: 'uuid1', a: 'b', c: 'd', feedTag: {}})

    expect(api.request).toHaveBeenCalledWith({
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
    subscriptionApi.saveSubscription({uuid: 'uuid1', feedTag: {name: 'expected name'}})

    expect(api.request).toHaveBeenCalledWith({
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
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(subscriptionApi.saveSubscription({})).resolves.toBeNull()
  })

  it('should call GET subscriptions endpoint for uuid1', () => {
    subscriptionApi.fetchSubscription('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}/uuid1`
    })
  })

  it('should return expected response when GET subscription for uuid1 succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce({a: 'b', c: 'd'})

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
    api.request = jest.fn().mockResolvedValueOnce({feedTag: null})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: undefined,
        name: undefined,
        color: undefined
      }
    })
  })

  it('should return expected response with feedTag when GET subscription for uuid1 succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce({feedTag: {uuid: 'uuid1', name: 'name1', color: 'color1'}})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: 'uuid1',
        name: 'name1',
        color: 'color1'
      }
    })
  })

  it('should call GET subscriptions endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({content: []})
    subscriptionApi.fetchSubscriptions()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}`
    })
  })

  it('should return expected response when GET subscriptions succeeded', async () => {
    const data = {
      content: [
        {uuid: '1'},
        {uuid: '2', feedTag: {uuid: '2'}}
      ]
    }
    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(subscriptionApi.fetchSubscriptions()).resolves.toEqual([
      {uuid: '1', feedTag: {}},
      {uuid: '2', feedTag: {uuid: '2'}}
    ])
  })
})
