import {
  deleteFeed,
  feedDeleted,
  feedsReceived,
  fetchFeed,
  fetchFeeds,
  saveFeed
} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('admin actions', () => {

  let store

  beforeEach(() => store = createMockStore())

  describe('action creator feedsReceived', () => {

    it('should contain expected action type', () => {
      store.dispatch(feedsReceived({}))

      expect(store.getActionTypes()).toEqual(['FEEDS_RECEIVED'])
    })

    it('should contain expected action data', () => {
      store.dispatch(feedsReceived({content: [{a: 'b', links: [{rel: 'self', href: '/path'}]}]}))

      expect(store.getActions()[0]).toContainActionData({feeds: [{a: 'b', links: {self: {path: '/path', query: {}}}}]})
    })
  })

  describe('action creator fetchFeeds', () => {

    it('should contain expected action type', () => {
      store.dispatch(fetchFeeds())

      expect(store.getActionTypes()).toEqual(['GET_FEEDS'])
    })

    it('should contain expected action data', () => {
      store.dispatch(fetchFeeds())

      expect(store.getActions()[0].url).toContain('/feeds')
    })

    it('should dispatch action defined in success property', () => {
      store.dispatch(fetchFeeds().success({content: [{a: 'b', links: []}]}))

      expect(store.getActionTypes()).toEqual(['FEEDS_RECEIVED'])
      expect(store.getActions()[0]).toContainActionData({feeds: [{a: 'b', links: {}}]})
    })
  })

  describe('action creator feedDeleted', () => {

    it('should contain expected action type', () => {
      store.dispatch(feedDeleted())

      expect(store.getActionTypes()).toEqual(['FEED_DELETED'])
    })

    it('should contain expected action data', () => {
      store.dispatch(feedDeleted('expectedUuid'))

      expect(store.getActions()[0]).toContainActionData({uuid: 'expectedUuid'})
    })
  })

  describe('action creator deleteFeed', () => {

    it('should contain expected actions', () => {
      const success = () => ({})
      const error = () => ({})

      store.dispatch(deleteFeed({uuid: 'expectedUuid', success, error}))

      expect(store.getActions()[0]).toEqual({
        type: 'DELETE_FEED',
        url: 'api/2/feeds/expectedUuid',
        success,
        error
      })
    })
  })

  describe('action creator fetchFeed', () => {

    it('should dispatch load action when feed fetched', () => {
      const success = () => ({})
      store.dispatch(fetchFeed({uuid: 'uuid1', success}))

      expect(store.getActions()[0]).toEqual({
        type: 'GET_FEED',
        url: 'api/2/feeds/uuid1',
        success
      })
    })
  })

  describe('action creator saveFeed', () => {

    it('should contain expected action', () => {
      const success = () => ({})
      const error = () => ({})
      const finalize = () => ({})

      store.dispatch(saveFeed({feed: {uuid: '1', title: 'expected title'}, success, error, finalize}))

      expect(store.getActions()[0]).toEqual(expect.objectContaining({
        type: 'PATCH_FEED',
        url: 'api/2/feeds/1',
        body: {uuid: '1', title: 'expected title'},
        success,
        error,
        finalize
      }))
    })
  })
})
