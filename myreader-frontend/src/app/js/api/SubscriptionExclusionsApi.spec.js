import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {EXCLUSION_TAGS} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('SubscriptionExclusionsApi', () => {

  let subscriptionExclusionsApi

  beforeEach(() => {
    exchange.mockClear()
    subscriptionExclusionsApi = new SubscriptionExclusionsApi()
  })

  it('should call GET exclusion tags endpoint for uuid1 pattern', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionExclusionsApi.fetchExclusions('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`
    })
  })

  it('should return expected response when GET exclusion tags for uuid1 pattern succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {uuid: 'uuid1', a: 'b'},
        {uuid: 'uuid2', c: 'd'}
      ],
      e: 'f'
    })

    await expect(subscriptionExclusionsApi.fetchExclusions('uuid1')).resolves.toEqual({
      content: [
        {uuid: 'uuid1', a: 'b'},
        {uuid: 'uuid2', c: 'd'}
      ],
      e: 'f'
    })
  })

  it('should call POST exclusion tags endpoint for uuid1 pattern', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionExclusionsApi.saveExclusion('uuid1', 'expected pattern')

    expect(exchange).toHaveBeenCalledWith({
      method: 'POST',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`,
      body: {
        pattern: 'expected pattern'
      }
    })
  })

  it('should call DELETE exclusion tags endpoint for subscription uuid1 and for pattern uuid2', () => {
    exchange.mockResolvedValueOnce({})
    subscriptionExclusionsApi.removeExclusion('uuid1', 'uuid2')

    expect(exchange).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${EXCLUSION_TAGS}/uuid1/pattern/uuid2`,
    })
  })

  it('should return expected response when DELETE exclusion tags for subscription uuid1 and for pattern uuid2 succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(subscriptionExclusionsApi.removeExclusion()).resolves.toBeNull()
  })
})
