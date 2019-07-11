import {EntryApi} from './EntryApi'
import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../constants'

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

  it(`should call GET ${SUBSCRIPTION_ENTRIES} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    entryApi.fetchEntries({})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_ENTRIES}`
    })
  })

  it(`should call GET /expected-path endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    entryApi.fetchEntries({path: '/expected-path', query: {a: 'b'}})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/expected-path?a=b'
    })
  })

  it(`should return expected response when GET ${SUBSCRIPTION_ENTRIES} succeeded`, async () => {
    const data = {
      content: [
        {uuid: '1'},
        {uuid: '2'}
      ],
      links: [
        {rel: 'next', href: '/path?next=1'},
        {rel: 'previous', href: '/path'}
      ]
    }
    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(entryApi.fetchEntries({})).resolves.toEqual({
      entries: [
        {uuid: '1'},
        {uuid: '2'}
      ],
      links: {
        next: {
          path: '/path',
          query: {next: '1'}
        },
        previous: {
          path: '/path',
          query: {}
        }
      }
    })
  })

  it(`should return expected error response when GET ${SUBSCRIPTION_ENTRIES} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(entryApi.fetchEntries({})).rejects.toEqual(expectedError)
  })

  it(`should call PATCH ${SUBSCRIPTION_ENTRIES} endpoint`, () => {
    api.request = jest.fn().mockResolvedValue({ok: true, data: {content: []}})
    entryApi.updateEntry({uuid: '1', seen: true, tag: 'tag', a: 'b'})

    expect(api.request).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${SUBSCRIPTION_ENTRIES}/1`,
      body: {
        seen: true,
        tag: 'tag'
      }
    })
  })

  it(`should return expected response when PATCH ${SUBSCRIPTION_ENTRIES} succeeded`, async () => {
    const data = {
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    }
    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(entryApi.updateEntry({})).resolves.toEqual({
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    })
  })

  it(`should return expected error response when PATCH ${SUBSCRIPTION_ENTRIES} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(entryApi.updateEntry({})).rejects.toEqual(expectedError)
  })
})
