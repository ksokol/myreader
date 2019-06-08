import {fetchSubscription, fetchSubscriptions, saveSubscriptionTag, subscriptionsReceived} from '../../store'
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
      store.dispatch(subscriptionsReceived())
      expect(store.getActions()[0]).toContainActionData({subscriptions: []})
    })

    it('should return expected action data', () => {
      store.dispatch(subscriptionsReceived({content: [{key: 'value1'}, {key: 'value2'}]}))
      expect(store.getActions()[0]).toContainActionData({subscriptions: [{key: 'value1'}, {key: 'value2'}]})
    })
  })

  describe('action creator fetchSubscriptions', () => {

    it('should use HTTP verb GET as type', () => {
      store.dispatch(fetchSubscriptions())
      expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS'])
    })

    it('should fetch all subscriptions', () => {
      store.dispatch(fetchSubscriptions())
      expect(store.getActions()[0]).toContainActionData({url: 'api/2/subscriptions'})
    })

    it('should dispatch SUBSCRIPTIONS_RECEIVED action on success', () => {
      store.dispatch(fetchSubscriptions())
      store.dispatch(store.getActions()[0].success({}))

      expect(store.getActions()[1]).toEqualActionType('SUBSCRIPTIONS_RECEIVED')
    })

    it('should convert response data on success', () => {
      store.dispatch(fetchSubscriptions())
      store.dispatch(store.getActions()[0].success({content: [{uuid: 1}]}))

      expect(store.getActions()[1]).toContainObject({subscriptions: [{uuid: 1}]})
    })
  })

  describe('action creator fetchSubscription', () => {

    it('should contain expected action', () => {
      const success = () => ({})
      const action = fetchSubscription({uuid: 'uuid1', success})

      expect(action).toEqual({
        type: 'GET_SUBSCRIPTION',
        url: 'api/2/subscriptions/uuid1',
        success
      })
    })
  })

  describe('action creator saveSubscriptionTag', () => {

    it('should contain expected action type', () => {
      store.dispatch(saveSubscriptionTag({}))

      expect(store.getActionTypes()).toEqual(['PATCH_SUBSCRIPTION_TAG'])
    })

    it('should contain expected url', () => {
      store.dispatch(saveSubscriptionTag({uuid: 'uuid1'}))

      expect(store.getActions()[0].url).toMatch(/\/subscriptionTags\/uuid1$/)
    })

    it('should contain expected body', () => {
      store.dispatch(saveSubscriptionTag({uuid: 'uuid1', a: 'b', c: 'd'}))

      expect(store.getActions()[0].body).toEqual({uuid: 'uuid1', a: 'b', c: 'd'})
    })

    it('should dispatch success actions when subscription tag saved', () => {
      store.dispatch(saveSubscriptionTag('uuid1'))
      const success = store.getActions()[0].success
      store.clearActions()
      success({uuid: 'uuid1', a: 'b', c: 'd'}).forEach(action => store.dispatch(action))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_TAG_CHANGED', 'SHOW_NOTIFICATION'])
      expect(store.getActions()[0]).toContainActionData({subscriptionTag: {uuid: 'uuid1', a: 'b', c: 'd'}})
      expect(store.getActions()[1]).toContainActionData({notification: {text: 'Tag updated', type: 'success'}})
    })
  })
})
