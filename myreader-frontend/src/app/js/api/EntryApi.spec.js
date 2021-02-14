import {EntryApi} from './EntryApi'
import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('EntryApi', () => {

  let entryApi

  beforeEach(() => {
    exchange.mockClear()
    entryApi = new EntryApi()
  })

  it('should call GET available tags endpoint', () => {
    exchange.mockResolvedValueOnce({content: []})
    entryApi.fetchEntryTags()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${ENTRY_AVAILABLE_TAGS}`
    })
  })

  it('should return expected response when GET available tags succeeded', async () => {
    exchange.mockResolvedValueOnce(['a', 'b'])

    await expect(entryApi.fetchEntryTags()).resolves.toEqual(['a', 'b'])
  })

  it('should call GET subscription entry endpoint', () => {
    exchange.mockResolvedValueOnce({content: []})
    entryApi.fetchEntries({})

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${SUBSCRIPTION_ENTRIES}`
    })
  })

  it('should call GET expected-path endpoint', () => {
    exchange.mockResolvedValueOnce({content: []})
    entryApi.fetchEntries({path: '/expected-path', query: {a: 'b'}})

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: '/expected-path?a=b'
    })
  })

  it('should return expected response when GET subscription entries succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {uuid: '1'},
        {uuid: '2'}
      ],
      next: '/path?next=1',
    })

    await expect(entryApi.fetchEntries({})).resolves.toEqual({
      entries: [
        {uuid: '1'},
        {uuid: '2'}
      ],
      links: {
        next: {
          path: '/path',
          query: {next: '1'}
        }
      }
    })
  })

  it('should call PATCH subscription entries endpoint', () => {
    exchange.mockResolvedValueOnce({content: []})
    entryApi.updateEntry({uuid: '1', seen: true, tags: ['tag'], a: 'b', context: {c: 'd'}})

    expect(exchange).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${SUBSCRIPTION_ENTRIES}/1`,
      body: {
        seen: true,
        tags: ['tag']
      }
    })
  })

  it('should return expected response when PATCH subscription entries succeeded', async () => {
    exchange.mockResolvedValue({
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    })

    await expect(entryApi.updateEntry({})).resolves.toEqual({
      uuid: '1',
      seen: true,
      tag: 'tag',
      a: 'b'
    })
  })
})
