import {FeedApi} from './FeedApi'
import {FEEDS} from '../constants'

const expectedError = 'expected error'

describe('FeedApi', () => {

  let api, feedApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    feedApi = new FeedApi(api)
  })

  it(`should GET ${FEEDS}/uuid1/fetchError with proper url derived from uuid`, () => {
    feedApi.fetchFeedFetchErrors('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1/fetchError`
    })
  })

  it(`should GET ${FEEDS}/uuid1/fetchError with proper url derived from object`, () => {
    feedApi.fetchFeedFetchErrors({path: `${FEEDS}/uuid2/fetchError`})

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid2/fetchError`
    })
  })

  it(`should return expected response when GET ${FEEDS}/uuid1/fetchError succeeded`, async () => {
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

    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(feedApi.fetchFeedFetchErrors('uuid1')).resolves.toEqual({
      links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
      failures: [
        {uuid: 'uuid1', message: 'message1', createdAt: 'createdAt1'},
        {uuid: 'uuid2', message: 'message2', createdAt: 'createdAt2'}
      ]
    })
  })

  it(`should return expected error response when ${FEEDS}/uuid1/fetchError failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(feedApi.fetchFeedFetchErrors('uuid1')).rejects.toEqual(expectedError)
  })

  it(`should GET ${FEEDS}`, () => {
    feedApi.fetchFeeds()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: FEEDS
    })
  })

  it(`should return expected response when GET ${FEEDS} succeeded`, async () => {
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

    api.request = jest.fn().mockResolvedValue({ok: true, data})

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

  it(`should return expected error response when GET ${FEEDS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(feedApi.fetchFeeds()).rejects.toEqual(expectedError)
  })

  it(`should GET ${FEEDS}`, () => {
    feedApi.fetchFeed('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: `${FEEDS}/uuid1`
    })
  })

  it(`should return expected response when GET ${FEEDS} succeeded`, async () => {
    const data = {
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
    }

    api.request = jest.fn().mockResolvedValue({ok: true, data})

    await expect(feedApi.fetchFeed('uuid1')).resolves.toEqual({
      uuid: 'uuid1',
      a: 'b',
      c: 'd',
      links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
    })
  })

  it(`should return expected error response when GET ${FEEDS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(feedApi.fetchFeed('uuid1')).rejects.toEqual(expectedError)
  })

  it(`should PATCH ${FEEDS}`, () => {
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

  it(`should return expected response when PATCH ${FEEDS} succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(feedApi.saveFeed({uuid: 'uuid1'})).resolves.toBeNull()
  })

  it(`should return expected error response when PATCH ${FEEDS} failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

    await expect(feedApi.saveFeed({uuid: 'uuid1'})).rejects.toEqual(expectedError)
  })

  it(`should DELETE ${FEEDS}`, () => {
    feedApi.deleteFeed('uuid1')

    expect(api.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: `${FEEDS}/uuid1`
    })
  })

  it(`should return expected response when DELETE ${FEEDS} succeeded`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: true})

    await expect(feedApi.deleteFeed('uuid1')).resolves.toBeNull()
  })

  it(`should return expected error response when DELETE ${FEEDS}/uuid1 failed`, async () => {
    api.request = jest.fn().mockResolvedValue({ok: false, status: 500, data: expectedError})

    await expect(feedApi.deleteFeed('uuid1')).rejects.toEqual({
      status: 500,
      data: expectedError
    })
  })
})
