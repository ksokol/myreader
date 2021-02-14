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
    exchange.mockResolvedValueOnce([])
    subscriptionTagsApi.fetchSubscriptionTags()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_TAGS}`
    })
  })

  it('should return expected response when GET subscription tags succeeded', async () => {
    exchange.mockResolvedValueOnce(['a', 'b'])

    await expect(subscriptionTagsApi.fetchSubscriptionTags()).resolves.toEqual(['a', 'b'])
  })
})
