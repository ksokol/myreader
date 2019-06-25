import {SubscriptionTagsApi} from './SubscriptionTagsApi'
import {SUBSCRIPTION_TAGS} from '../constants'

const expectedError = 'expected error'

describe('SubscriptionTagsApi', () => {

  let api, subscriptionTagsApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    subscriptionTagsApi = new SubscriptionTagsApi(api)
  })

  it(`should call GET ${SUBSCRIPTION_TAGS} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    subscriptionTagsApi.fetchSubscriptionTags()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_TAGS}`
    })
  })

  it(`should return expected response when GET ${SUBSCRIPTION_TAGS} succeeded`, async () => {
    const data = {content: [{a: 'b'}, {c: 'd'}]}
    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(subscriptionTagsApi.fetchSubscriptionTags()).resolves.toEqual([
      {a: 'b'},
      {c: 'd'}
    ])
  })

  it(`should return expected error response when GET ${SUBSCRIPTION_TAGS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionTagsApi.fetchSubscriptionTags()).rejects.toEqual(expectedError)
  })

  it(`should call PATCH ${SUBSCRIPTION_TAGS}/uuid1 endpoint`, () => {
    subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1', a: 'b', c: 'd'})

    expect(api.request).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${SUBSCRIPTION_TAGS}/uuid1`,
      body: {
        uuid: 'uuid1',
        a: 'b',
        c: 'd'
      }
    })
  })

  it(`should return expected response when PATCH ${SUBSCRIPTION_TAGS}/uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {a: 'b', c: 'd'}})

    await expect(subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1'})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })

  it(`should return expected error response when PATCH ${SUBSCRIPTION_TAGS}/uuid1 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1'})).rejects.toEqual(expectedError)
  })
})
