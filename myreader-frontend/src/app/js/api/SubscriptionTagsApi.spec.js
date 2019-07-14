import {SubscriptionTagsApi} from './SubscriptionTagsApi'
import {SUBSCRIPTION_TAGS} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('SubscriptionTagsApi', () => {

  let subscriptionTagsApi

  beforeEach(() => {
    exchange.mockClear()
    subscriptionTagsApi = new SubscriptionTagsApi()
  })

  it('should call GET subscription tags endpoint', () => {
    exchange.mockResolvedValueOnce({data: {content: []}})
    subscriptionTagsApi.fetchSubscriptionTags()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_TAGS}`
    })
  })

  it('should return expected response when GET subscription tags succeeded', async () => {
    exchange.mockResolvedValueOnce({content: [{a: 'b'}, {c: 'd'}]})

    await expect(subscriptionTagsApi.fetchSubscriptionTags()).resolves.toEqual({
      content: [
        {a: 'b'},
        {c: 'd'}
      ]
    })
  })

  it('should call PATCH subscription tags endpoint for uuid1', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1', a: 'b', c: 'd'})

    expect(exchange).toHaveBeenCalledWith({
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
    exchange.mockResolvedValueOnce({a: 'b', c: 'd'})

    await expect(subscriptionTagsApi.saveSubscriptionTag({uuid: 'uuid1'})).resolves.toEqual({
      a: 'b',
      c: 'd'
    })
  })
})
