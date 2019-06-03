import {
  deleteFeed,
  fetchFeed,
  saveFeed
} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('admin actions', () => {

  let store

  beforeEach(() => store = createMockStore())

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
