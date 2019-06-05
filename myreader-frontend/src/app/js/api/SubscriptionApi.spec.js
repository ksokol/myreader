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
})
