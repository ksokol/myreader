import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {EXCLUSION_TAGS} from '../constants'

const expectedError = 'expected error'

describe('SubscriptionExclusionsApi', () => {

  let api, subscriptionExclusionsApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true, content: []})
    }
    subscriptionExclusionsApi = new SubscriptionExclusionsApi(api)
  })

  it(`should call GET ${EXCLUSION_TAGS}/uuid1/pattern endpoint`, () => {
    subscriptionExclusionsApi.fetchExclusions('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`
    })
  })

  it(`should return expected response when GET ${EXCLUSION_TAGS}/uuid1/pattern succeeded`, async () => {
    const data = {
      content: [
        {uuid: 'uuid1', a: 'b'},
        {uuid: 'uuid2', c: 'd'}
      ],
      e: 'f'
    }

    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(subscriptionExclusionsApi.fetchExclusions('uuid1')).resolves.toEqual([
      {uuid: 'uuid1', a: 'b'},
      {uuid: 'uuid2', c: 'd'}
    ])
  })

  it(`should return expected error response when GET ${EXCLUSION_TAGS}/uuid1/pattern failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionExclusionsApi.fetchExclusions('uuid1')).rejects.toEqual(expectedError)
  })

  it(`should call POST ${EXCLUSION_TAGS}/uuid1/pattern endpoint`, () => {
    subscriptionExclusionsApi.saveExclusion('uuid1', 'expected pattern')

    expect(api.request).toHaveBeenCalledWith({
      method: 'POST',
      url: `${EXCLUSION_TAGS}/uuid1/pattern`,
      body: {
        pattern: 'expected pattern'
      }
    })
  })

  it(`should return expected error response when POST ${EXCLUSION_TAGS}/uuid1/pattern failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, status: 400, data: expectedError})

    await expect(subscriptionExclusionsApi.saveExclusion({})).rejects.toEqual(expectedError)
  })

  it(`should call DELETE ${EXCLUSION_TAGS}/uuid1/pattern/uuid2 endpoint`, () => {
    subscriptionExclusionsApi.removeExclusion('uuid1', 'uuid2')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${EXCLUSION_TAGS}/uuid1/pattern/uuid2`,
    })
  })

  it(`should return expected response when DELETE ${EXCLUSION_TAGS}/uuid1/pattern/uuid2 succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(subscriptionExclusionsApi.removeExclusion()).resolves.toBeNull()
  })

  it(`should return expected error response when DELETE ${EXCLUSION_TAGS}/uuid1/pattern/uuid2 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(subscriptionExclusionsApi.removeExclusion()).rejects.toEqual(expectedError)
  })
})
