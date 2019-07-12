import {SubscriptionApi} from './SubscriptionApi'
import {SUBSCRIPTIONS} from '../constants'

const expectedError = 'expected error'

describe('SubscriptionApi', () => {

  let api, subscriptionApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    subscriptionApi = new SubscriptionApi(api)
  })

  it(`should call POST ${SUBSCRIPTIONS} endpoint`, () => {
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

  it(`should return expected response when POST ${SUBSCRIPTIONS} succeeded`, async () => {
    const data = {a: 'b', c: 'd'}

    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(subscriptionApi.subscribe({})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })

  it(`should return expected error response when POST ${SUBSCRIPTIONS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, status: 400, data: expectedError})

    await expect(subscriptionApi.subscribe({})).rejects.toEqual({
      status: 400,
      data: expectedError
    })
  })

  it(`should call DELETE ${SUBSCRIPTIONS}/uuid1 endpoint`, () => {
    subscriptionApi.deleteSubscription('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${SUBSCRIPTIONS}/uuid1`,
    })
  })

  it(`should return expected response when DELETE ${SUBSCRIPTIONS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(subscriptionApi.deleteSubscription()).resolves.toBeNull()
  })

  it(`should return expected error response when DELETE ${SUBSCRIPTIONS}/uuid1 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionApi.deleteSubscription()).rejects.toEqual(expectedError)
  })

  it(`should call PATCH ${SUBSCRIPTIONS}/uuid1 endpoint`, () => {
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

  it(`should call PATCH ${SUBSCRIPTIONS}/uuid1 endpoint with feedTag set`, () => {
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

  it(`should return expected response when PATCH ${SUBSCRIPTIONS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(subscriptionApi.saveSubscription({})).resolves.toBeNull()
  })

  it(`should return expected error response when PATCH ${SUBSCRIPTIONS}/uuid1 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionApi.saveSubscription({})).rejects.toEqual(expectedError)
  })

  it(`should call GET ${SUBSCRIPTIONS}/uuid1 endpoint`, () => {
    subscriptionApi.fetchSubscription('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}/uuid1`
    })
  })

  it(`should return expected response when GET ${SUBSCRIPTIONS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {a: 'b', c: 'd'}})

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

  it(`should return expected response with feedTag null when GET ${SUBSCRIPTIONS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {feedTag: null}})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: undefined,
        name: undefined,
        color: undefined
      }
    })
  })

  it(`should return expected response with feedTag when GET ${SUBSCRIPTIONS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {feedTag: {uuid: 'uuid1', name: 'name1', color: 'color1'}}})

    await expect(subscriptionApi.fetchSubscription()).resolves.toEqual({
      feedTag: {
        uuid: 'uuid1',
        name: 'name1',
        color: 'color1'
      }
    })
  })

  it(`should return expected error response when GET ${SUBSCRIPTIONS}/uuid1 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionApi.fetchSubscription()).rejects.toEqual(expectedError)
  })

  it(`should call GET ${SUBSCRIPTIONS} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    subscriptionApi.fetchSubscriptions()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTIONS}`
    })
  })

  it(`should return expected response when GET ${SUBSCRIPTIONS} succeeded`, async () => {
    const data = {
      content: [
        {uuid: '1'},
        {uuid: '2', feedTag: {uuid: '2'}}
      ]
    }
    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(subscriptionApi.fetchSubscriptions()).resolves.toEqual([
      {uuid: '1', feedTag: {}},
      {uuid: '2', feedTag: {uuid: '2'}}
    ])
  })

  it(`should return expected error response when GET ${SUBSCRIPTIONS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionApi.fetchSubscriptions()).rejects.toEqual(expectedError)
  })
})
