import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {EXCLUSION_TAGS} from '../constants'

describe('SubscriptionExclusionsApi', () => {

  let api, subscriptionExclusionsApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    subscriptionExclusionsApi = new SubscriptionExclusionsApi(api)
  })

  it('should call GET exclusion tags endpoint for uuid1 pattern', () => {
    subscriptionExclusionsApi.fetchExclusions('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`
    })
  })

  it('should return expected response when GET exclusion tags for uuid1 pattern succeeded', async () => {
    const data = {
      content: [
        {uuid: 'uuid1', a: 'b'},
        {uuid: 'uuid2', c: 'd'}
      ],
      e: 'f'
    }

    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(subscriptionExclusionsApi.fetchExclusions('uuid1')).resolves.toEqual({
      content: [
        {uuid: 'uuid1', a: 'b'},
        {uuid: 'uuid2', c: 'd'}
      ],
      e: 'f'
    })
  })

  it('should call POST exclusion tags endpoint for uuid1 pattern', () => {
    subscriptionExclusionsApi.saveExclusion('uuid1', 'expected pattern')

    expect(api.request).toHaveBeenCalledWith({
      method: 'POST',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`,
      body: {
        pattern: 'expected pattern'
      }
    })
  })

  it('should call DELETE exclusion tags endpoint for subscription uuid1 and for pattern uuid2', () => {
    subscriptionExclusionsApi.removeExclusion('uuid1', 'uuid2')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${EXCLUSION_TAGS}/uuid1/pattern/uuid2`,
    })
  })

  it('should return expected response when DELETE exclusion tags for subscription uuid1 and for pattern uuid2 succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(subscriptionExclusionsApi.removeExclusion()).resolves.toBeNull()
  })
})
