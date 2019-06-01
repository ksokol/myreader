import {FeedApi} from './FeedApi'
import {FEEDS} from '../constants'

describe('FeedApi', () => {

  let api, feedApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    feedApi = new FeedApi(api)
  })

  describe(`${FEEDS}/uuid1/fetchError`, () => {

    it('should call endpoint with proper url derived from uuid', () => {
      feedApi.fetchFeedFetchErrors('uuid1')

      expect(api.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `${FEEDS}/uuid1/fetchError`
      })
    })

    it('should call endpoint with proper url derived from object', () => {
      feedApi.fetchFeedFetchErrors({path: `${FEEDS}/uuid2/fetchError`})

      expect(api.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `${FEEDS}/uuid2/fetchError`
      })
    })

    it('should return expected response when request succeeded', async () => {
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

    it('should return expected error response when request failed', async () => {
      api.request = jest.fn().mockResolvedValue({ok: false, data: 'expected error'})

      await expect(feedApi.fetchFeedFetchErrors('uuid1')).rejects.toEqual('expected error')
    })
  })
})
