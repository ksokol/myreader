import {SubscriptionTagsApi} from './SubscriptionTagsApi'
import {SUBSCRIPTION_TAGS} from '../constants'

describe('SubscriptionTagsApi', () => {

  let api, subscriptionTagsApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    subscriptionTagsApi = new SubscriptionTagsApi(api)
  })

  it('should call GET subscription tags endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({data: {content: []}})
    subscriptionTagsApi.fetchSubscriptionTags()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_TAGS}`
    })
  })

  it('should return expected response when GET subscription tags succeeded', async () => {
    const data = {content: [{a: 'b'}, {c: 'd'}]}
    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(subscriptionTagsApi.fetchSubscriptionTags()).resolves.toEqual({
      content: [
        {a: 'b'},
        {c: 'd'}
      ]
    })
  })

  it('should call PATCH subscription tags endpoint for uuid1', () => {
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

  it(`should return expected response when PATCH subscription tags for uuid1 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValueOnce({a: 'b', c: 'd'})

    await expect(subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1'})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })
})
