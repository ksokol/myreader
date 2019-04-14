import {createMockStore} from '../../shared/test-utils'
import {routeChange} from '../../store'

describe('router actions', () => {

  let store

  beforeEach(() => store = createMockStore())

  describe('action creator routeChange', () => {

    it('should contain expected action type', () => {
      store.dispatch(routeChange())
      expect(store.getActionTypes()).toEqual(['ROUTE_CHANGED'])
    })

    it('should contain expected action data', () => {
      store.dispatch(routeChange({route: ['app', 'bookmarks']}))
      expect(store.getActions()[0]).toContainActionData({
        route: ['app', 'bookmarks'],
        options: {}
      })
    })

    it('should contain expected options', () => {
      store.dispatch(routeChange({route: ['app', 'bookmarks']}, {reload: true}))
      expect(store.getActions()[0].options).toEqual({reload: true})
    })
  })
})
