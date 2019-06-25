import {EntryApi} from './EntryApi'
import {ENTRY_AVAILABLE_TAGS} from '../constants'

const expectedError = 'expected error'

describe('EntryApi', () => {

  let api, entryApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    entryApi = new EntryApi(api)
  })

  it(`should call GET ${ENTRY_AVAILABLE_TAGS} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    entryApi.fetchEntryTags()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${ENTRY_AVAILABLE_TAGS}`
    })
  })

  it(`should return expected response when GET ${ENTRY_AVAILABLE_TAGS} succeeded`, async () => {
    const data = ['a', 'b']
    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(entryApi.fetchEntryTags()).resolves.toEqual(['a', 'b'])
  })

  it(`should return expected error response when GET ${ENTRY_AVAILABLE_TAGS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(entryApi.fetchEntryTags()).rejects.toEqual(expectedError)
  })
})
