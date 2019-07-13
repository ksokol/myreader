import {FeedApi} from './FeedApi'
import {FEEDS} from '../constants'

describe('FeedApi', () => {

  let api, feedApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({content: []})
    }
    feedApi = new FeedApi(api)
  })

  it('should GET feed errors for uuid1 with proper url derived from uuid', () => {
    feedApi.fetchFeedFetchErrors('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1/fetchError`
    })
  })

  it('should GET feed errors for uuid1 with proper url derived from object', () => {
    feedApi.fetchFeedFetchErrors({path: `${FEEDS}/uuid2/fetchError`})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid2/fetchError`
    })
  })

  it('should return expected response when GET feeds error for uuid1 succeeded', async () => {
    const data = {
      content: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'},
      ],
      links: [
        {rel: 'self', href: 'self href?a=b'},
        {rel: 'next', href: 'next href'}
      ]
    }

    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(feedApi.fetchFeedFetchErrors('uuid1')).resolves.toEqual({
      links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
      failures: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'}
      ]
    })
  })

  it('should GET feeds', () => {
    feedApi.fetchFeeds()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: FEEDS
    })
  })

  it('should return expected response when GET feeds succeeded', async () => {
    const data = {
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
    }

    api.request = jest.fn().mockResolvedValueOnce(data)

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
    feedApi.fetchFeed('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1`
    })
  })

  it('should return expected response when GET feed succeeded', async () => {
    const data = {
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
    }

    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(feedApi.fetchFeed('uuid1')).resolves.toEqual({
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
    })
  })

  it('should PATCH feed', () => {
    feedApi.saveFeed({uuid: 'uuid1', a: 'b', c: 'd'})

    expect(api.request).toHaveBeenCalledWith({
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
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(feedApi.saveFeed({uuid: 'uuid1'})).resolves.toBeNull()
  })

  it(`should DELETE ${FEEDS}`, () => {
    feedApi.deleteFeed('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${FEEDS}/uuid1`
    })
  })

  it('should return expected response when DELETE feed succeeded', async () => {
    api.request = jest.fn().mockResolvedValueOnce(null)

    await expect(feedApi.deleteFeed('uuid1')).resolves.toBeNull()
  })
})
