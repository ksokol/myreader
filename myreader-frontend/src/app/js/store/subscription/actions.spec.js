import {subscriptionsReceived} from '../../store'
import {createMockStore} from '../../shared/test-utils'

describe('subscription actions', () => {

  let store

  beforeEach(() => store = createMockStore())

  describe('action creator subscriptionsReceived', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionsReceived())
      expect(store.getActionTypes()).toEqual(['SUBSCRIPTIONS_RECEIVED'])
    })

    it('should return valid object when input is undefined', () => {
      store.dispatch(subscriptionsReceived([]))
      expect(store.getActions()[0]).toEqual(expect.objectContaining({subscriptions: []}))
    })

    it('should return expected action data', () => {
      store.dispatch(subscriptionsReceived([{key: 'value1'}, {key: 'value2'}]))
      expect(store.getActions()[0]).toEqual(expect.objectContaining({subscriptions: [{key: 'value1'}, {key: 'value2'}]}))
    })
  })
})
