import {FeedApi} from './FeedApi'
import {FEEDS} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('FeedApi', () => {

  let feedApi

  beforeEach(() => {
    exchange.mockClear()
    feedApi = new FeedApi()
  })

  it('should GET feed errors for uuid1 with proper url derived from uuid', () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.fetchFeedFetchErrors('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1/fetchError`
    })
  })

  it('should GET feed errors for uuid1 with proper url derived from object', () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.fetchFeedFetchErrors({path: `${FEEDS}/uuid2/fetchError`})

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid2/fetchError`
    })
  })

  it('should return expected response when GET feeds error for uuid1 succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'},
      ],
      links: [
        {rel: 'self', href: 'self href?a=b'},
        {rel: 'next', href: 'next href'}
      ]
    })

    await expect(feedApi.fetchFeedFetchErrors('uuid1')).resolves.toEqual({
      links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
      failures: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'}
      ]
    })
  })

  it('should GET feeds', () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.fetchFeeds()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: FEEDS
    })
  })

  it('should return expected response when GET feeds succeeded', async () => {
    exchange.mockResolvedValueOnce({
      content: [
        {
          uuid: 'uuid1',
          a: 'b',
          c: 'd',
          links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
        },
        {
          uuid: 'uuid2',
          e: 'f',
          links: [{rel: 'self', href: '/uuid2?a=b'}]
        }
      ]
    })

    await expect(feedApi.fetchFeeds()).resolves.toEqual([
      {
        uuid: 'uuid1',
        a: 'b',
        c: 'd',
        links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
      },
      {
        uuid: 'uuid2',
        e: 'f',
        links: {self: {path: '/uuid2', query: {a: 'b'}}}
      }
    ])
  })

  it('should GET feed', () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.fetchFeed('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1`
    })
  })

  it('should return expected response when GET feed succeeded', async () => {
    exchange.mockResolvedValueOnce({
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
    })

    await expect(feedApi.fetchFeed('uuid1')).resolves.toEqual({
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
    })
  })

  it('should PATCH feed', () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.saveFeed({uuid: 'uuid1', a: 'b', c: 'd'})

    expect(exchange).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${FEEDS}/uuid1`,
      body: {
        uuid: 'uuid1',
        a: 'b',
        c: 'd'
      }
    })
  })

  it('should return expected response when PATCH feed succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(feedApi.saveFeed({uuid: 'uuid1'})).resolves.toBeNull()
  })

  it(`should DELETE ${FEEDS}`, () => {
    exchange.mockResolvedValueOnce({content: []})
    feedApi.deleteFeed('uuid1')

    expect(exchange).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${FEEDS}/uuid1`
    })
  })

  it('should return expected response when DELETE feed succeeded', async () => {
    exchange.mockResolvedValueOnce(null)

    await expect(feedApi.deleteFeed('uuid1')).resolves.toBeNull()
  })
})
