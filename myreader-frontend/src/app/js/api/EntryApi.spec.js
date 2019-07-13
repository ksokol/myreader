import {EntryApi} from './EntryApi'
import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../constants'

describe('EntryApi', () => {

  let api, entryApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    entryApi = new EntryApi(api)
  })

  it('should call GET available tags endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({content: []})
    entryApi.fetchEntryTags()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${ENTRY_AVAILABLE_TAGS}`
    })
  })

  it('should return expected response when GET available tags succeeded', async () => {
    const data = ['a', 'b']
    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(entryApi.fetchEntryTags()).resolves.toEqual(['a', 'b'])
  })

  it('should call GET available tags endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({content: []})
    entryApi.fetchEntries({})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_ENTRIES}`
    })
  })

  it('should call GET expected-path endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({content: []})
    entryApi.fetchEntries({path: '/expected-path', query: {a: 'b'}})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/expected-path?a=b'
    })
  })

  it('should return expected response when GET subscription entries succeeded', async () => {
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
    api.request = jest.fn().mockResolvedValueOnce(data)

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

  it('should call PATCH subscription entries endpoint', () => {
    api.request = jest.fn().mockResolvedValueOnce({content: []})
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

  it('should return expected response when PATCH subscription entries succeeded', async () => {
    const data = {
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    }
    api.request = jest.fn().mockResolvedValue(data)

    await expect(entryApi.updateEntry({})).resolves.toEqual({
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    })
  })
})
