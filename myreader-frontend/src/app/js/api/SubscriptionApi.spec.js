import {SubscriptionApi} from './SubscriptionApi'
import {SUBSCRIPTIONS} from '../constants'

describe('SubscriptionApi', () => {

  let api, subscriptionApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    subscriptionApi = new SubscriptionApi(api)
  })

  it(`should POST ${SUBSCRIPTIONS}`, () => {
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

  it(`should return expected error response when ${SUBSCRIPTIONS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, status: 400, data: 'expected error'})

    await expect(subscriptionApi.subscribe({})).rejects.toEqual({
      status: 400,
      data: 'expected error'
    })
  })
})
