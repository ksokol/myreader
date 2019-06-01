import {
  applicationInfoReceived,
  deleteFeed,
  feedDeleted,
  feedFetchFailuresClear,
  feedFetchFailuresReceived,
  feedsReceived,
  fetchApplicationInfo,
  fetchFeed,
  fetchFeedFetchFailures,
  fetchFeeds,
  saveFeed
} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('admin actions', () => {

  let store

  beforeEach(() => store = createMockStore())

  describe('action creator applicationInfoReceived', () => {

    it('should contain expected action type', () => {
      store.dispatch(applicationInfoReceived())

      expect(store.getActionTypes()).toEqual(['APPLICATION_INFO_RECEIVED'])
    })

    it('should contain expected patch action type', () => {
      const raw = {
        git: {
          commit: {
            id: 'a'
          },
          branch: 'b'
        },
        build: {
          version: 'c',
          time: 'd'
        }
      }

      store.dispatch(applicationInfoReceived(raw))

      expect(store.getActions()[0]).toContainActionData({
        applicationInfo: {
          commitId: 'a',
          branch: 'b',
          version: 'c',
          buildTime: 'd'
        }
      })
    })
  })

  describe('action creator fetchApplicationInfo', () => {

    it('should contain expected action type', () => {
      store.dispatch(fetchApplicationInfo())

      expect(store.getActionTypes()).toEqual(['GET_APPLICATION_INFO'])
      expect(store.getActions()[0]).toContainActionData({url: 'info'})
    })

    it('should dispatch action defined in success property', () => {
      store.dispatch(fetchApplicationInfo())
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success())

      expect(store.getActionTypes()).toEqual(['APPLICATION_INFO_RECEIVED'])
      expect(store.getActions()[0]).toContainActionData({
        applicationInfo: {
          branch: 'not available',
          commitId: 'not available',
          version: 'not available',
          buildTime: ''
        }
      })
    })

    it('should dispatch action defined in error property', () => {
      store.dispatch(fetchApplicationInfo())
      const error = store.getActions()[0].error
      store.clearActions()
      store.dispatch(error())

      expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
      expect(store.getActions()[0]).toContainActionData({
        notification: {
          text: 'Application info is missing',
          type: 'error'
        }
      })
    })
  })

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

  describe('action creator feedFetchFailuresClear', () => {

    it('should contain expected action type', () => {
      store.dispatch(feedFetchFailuresClear())

      expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_CLEAR'])
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

  describe('action creator feedFetchFailuresReceived', () => {

    it('should contain expected action type', () => {
      store.dispatch(feedFetchFailuresReceived())

      expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_RECEIVED'])
    })

    it('should contain expected action data', () => {
      store.dispatch(feedFetchFailuresReceived({
        links: [{rel: 'expected rel', href: 'expected href'}],
        content: [{message: 'message 1'}]
      }))

      expect(store.getActions()[0]).toContainActionData({
        failures: [{message: 'message 1'}],
        links: {'expected rel': {path: 'expected href', query: {}}}
      })
    })
  })

  describe('action creator fetchFeedFetchFailures', () => {

    it('should contain expected action type', () => {
      store.dispatch(fetchFeedFetchFailures({}))

      expect(store.getActionTypes()).toEqual(['GET_FEED_FETCH_FAILURES'])
    })

    it('should contain expected action data', () => {
      store.dispatch(fetchFeedFetchFailures({path: 'expected-path', query: {a: 'b'}}))

      expect(store.getActions()[0]).toContainActionData({url: 'expected-path?a=b'})
    })

    it('should dispatch action defined in success property', () => {
      store.dispatch(fetchFeedFetchFailures({}))
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success({content: [{message: 'message 1'}], links: [{rel: 'self', href: '/expected'}]}))

      expect(store.getActionTypes()).toEqual(['FEED_FETCH_FAILURES_RECEIVED'])
      expect(store.getActions()[0]).toContainActionData({
        links: {self: {path: '/expected', query: {}}},
        failures: [{message: 'message 1'}]
      })
    })

    it('should contain expected action type in finalize function', () => {
      store.dispatch(fetchFeedFetchFailures({}))
      store.dispatch(store.getActions()[0].finalize())

      expect(store.getActionTypes()[1]).toEqual('FEED_FETCH_FAILURES_LOADED')
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
