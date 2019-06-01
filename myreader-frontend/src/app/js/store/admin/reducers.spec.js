import initialState from '.'
import {adminReducers} from '../../store'

describe('admin reducers', () => {

  let state, action

  beforeEach(() => state = initialState())

  it('initial state', () => {
    expect(adminReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state)
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
})
