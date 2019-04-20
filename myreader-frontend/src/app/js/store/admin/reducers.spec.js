import initialState from '.'
import {adminReducers} from '../../store'

describe('admin reducers', () => {

  let state, action

  beforeEach(() => state = initialState())

  it('initial state', () => {
    expect(adminReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state)
  })

  describe('action APPLICATION_INFO_RECEIVED', () => {

    it('should do nothing when no entry focused', () => {
      const action = {
        type: 'APPLICATION_INFO_RECEIVED',
        applicationInfo: {a: 'b', c: 'd'}
      }

      const currentState = {applicationInfo: {}}
      const expectedState = {applicationInfo: {a: 'b', c: 'd'}}

      expect(adminReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action SECURITY_UPDATE', () => {

    beforeEach(() => {
      action = {
        type: 'SECURITY_UPDATE',
        authorized: false
      }
    })

    it('should reset state when not authorized', () => {
      const currentState = {applicationInfo: {a: 'b'}}

      expect(adminReducers(currentState, action)).toContainObject(initialState())
    })

    it('should do nothing when authorized', () => {
      action.authorized = true

      const currentState = {applicationInfo: {a: 'b'}}
      const expectedState = {applicationInfo: {a: 'b'}}

      expect(adminReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action FEEDS_RECEIVED', () => {

    it('should add feeds', () => {
      state = {feeds: []}

      expect(adminReducers(state, {type: 'FEEDS_RECEIVED', feeds: [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]}))
        .toContainObject({feeds: [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]})
    })
  })

  describe('action FEED_DELETED', () => {

    it('should remove feed from store', () => {
      state = {feeds: [{uuid: '1'}, {uuid: '2'}]}

      expect(adminReducers(state, {type: 'FEED_DELETED', uuid: '1'}).feeds).toEqual([{uuid: '2'}])
    })
  })

  describe('action FEED_FETCH_FAILURES_CLEAR', () => {

    it('should clear feed fetch failures', () => {
      state = {
        fetchFailures: {
          failures: [1, 2],
          links: {
            self: {
              path: 'path1', query: {a: 'b', next: 'c'}
            }
          },
          totalElements: 2
        }
      }

      expect(adminReducers(state, {type: 'FEED_FETCH_FAILURES_CLEAR'}).fetchFailures).toEqual({failures: []})
    })
  })

  describe('action FEED_FETCH_FAILURES_RECEIVED', () => {

    beforeEach(() => {
      action = {
        type: 'FEED_FETCH_FAILURES_RECEIVED',
        links: {self: {path: 'path1', query: {a: 'b', next: 'c'}}},
        failures: [1, 2]
      }
    })

    it('should add feed fetch failures', () => {
      const expectedState = {
        fetchFailures: {
          failures: [1, 2],
          links: {
            self: {
              path: 'path1', query: {a: 'b', next: 'c'}
            }
          }
        }
      }

      expect(adminReducers(state, action)).toContainObject(expectedState)
    })

    it('should add next page to existing feed fetch failures when self link is the same', () => {
      const currentState = adminReducers(state, action)

      action = {
        ...action,
        links: {self: {path: 'path1', query: {a: 'b', next: 'd'}}},
        failures: [3, 4]
      }

      const expectedState = {
        fetchFailures: {
          links: {self: {path: 'path1', query: {a: 'b', next: 'd'}}},
          failures: [1, 2, 3, 4]
        }
      }

      expect(adminReducers(currentState, action)).toContainObject(expectedState)
    })

    it('should replace existing feed fetch failures when self link is different', () => {
      const currentState = adminReducers(state, action)

      action = {
        ...action,
        links: {self: {path: 'path2', query: {a: 'b', next: 'd'}}},
        failures: [3, 4, 5]
      }

      const expectedState = {
        fetchFailures: {
          links: {self: {path: 'path2', query: {a: 'b', next: 'd'}}},
          failures: [3, 4, 5]
        }
      }

      expect(adminReducers(currentState, action)).toContainObject(expectedState)
    })
  })
})
