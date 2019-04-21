import {
  addSubscriptionExclusionPattern,
  deleteSubscription,
  fetchSubscriptionExclusionPatterns,
  fetchSubscriptions,
  fetchSubscription,
  removeSubscriptionExclusionPattern,
  saveSubscribeEditForm,
  saveSubscriptionEditForm,
  saveSubscriptionTag,
  subscriptionDeleted,
  subscriptionExclusionPatternsAdded,
  subscriptionExclusionPatternsReceived,
  subscriptionExclusionPatternsRemoved,
  subscriptionsReceived
} from '../../store'
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

  describe('action creator subscriptionDeleted', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionDeleted('1'))
      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_DELETED'])
    })

    it('should return expected action data', () => {
      store.dispatch(subscriptionDeleted('1'))
      expect(store.getActions()[0]).toContainActionData({uuid: '1'})
    })
  })

  describe('action creator deleteSubscription', () => {

    it('should contain expected action type', () => {
      const success = () => ({})
      const finalize = () => ({})
      const action = deleteSubscription({uuid: 'uuid1', success, finalize})

      expect(action).toEqual({
        type: 'DELETE_SUBSCRIPTION',
        url: 'api/2/subscriptions/uuid1',
        success,
        finalize
      })
    })
  })

  describe('action creator saveSubscriptionEditForm', () => {

    it('should contain expected action', () => {
      const success = () => ({})
      const error = () => ({})
      const finalize = () => ({})

      const action = saveSubscriptionEditForm({
        subscription: {uuid: 'uuid1', feedTag: {name: 'feedTag'}},
        success,
        error,
        finalize
      })

      expect(action).toEqual({
        type: 'PATCH_SUBSCRIPTION',
        url: 'api/2/subscriptions/uuid1',
        body: {
          uuid: 'uuid1',
          feedTag: {
            name: 'feedTag'
          }
        },
        success,
        error,
        finalize
      })
    })
  })

  describe('action creator subscriptionExclusionPatternsReceived', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionExclusionPatternsReceived())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(subscriptionExclusionPatternsReceived('expected uuid', {content: [{pattern: 'a'}, {pattern: 'b'}]}))

      expect(store.getActions()[0]).toContainActionData({
        subscriptionUuid: 'expected uuid',
        patterns: [{pattern: 'a'}, {pattern: 'b'}]
      })
    })
  })

  describe('action creator fetchSubscriptionExclusionPatterns', () => {

    it('should contain expected action type', () => {
      store.dispatch(fetchSubscriptionExclusionPatterns())

      expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION_EXCLUSION_PATTERNS'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(fetchSubscriptionExclusionPatterns('expected uuid'))

      expect(store.getActions()[0].url).toMatch(/api\/2\/exclusions\/expected uuid\/pattern$/)
    })

    it('should dispatch actions defined in success property', () => {
      store.dispatch(fetchSubscriptionExclusionPatterns('expected uuid'))
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success({content: [{pattern: 'a'}, {pattern: 'b'}]}))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED'])
      expect(store.getActions()[0]).toContainActionData({
        subscriptionUuid: 'expected uuid',
        patterns: [{pattern: 'a'}, {pattern: 'b'}]
      })
    })
  })

  describe('action creator subscriptionExclusionPatternsAdded', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionExclusionPatternsAdded())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(subscriptionExclusionPatternsAdded('expected subscription uuid', {
        uuid: '1',
        hitCount: 0,
        pattern: 'a'
      }))

      expect(store.getActions()[0])
        .toContainActionData({
          subscriptionUuid: 'expected subscription uuid',
          pattern: {uuid: '1', hitCount: 0, pattern: 'a'}
        })
    })
  })

  describe('action creator addSubscriptionExclusionPattern', () => {

    it('should contain expected action type', () => {
      store.dispatch(addSubscriptionExclusionPattern())

      expect(store.getActionTypes()).toEqual(['POST_SUBSCRIPTION_EXCLUSION_PATTERN'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(addSubscriptionExclusionPattern('1', 'expected pattern'))

      expect(store.getActions()[0].url).toMatch(/api\/2\/exclusions\/1\/pattern$/)
      expect(store.getActions()[0]).toContainActionData({body: {pattern: 'expected pattern'}})
    })

    it('should dispatch actions defined in success property', () => {
      const success = addSubscriptionExclusionPattern('1').success
      store.dispatch(success({uuid: '2', hitCount: 0, pattern: 'a'}))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED'])
      expect(store.getActions()[0]).toContainActionData({
        subscriptionUuid: '1',
        pattern: {uuid: '2', hitCount: 0, pattern: 'a'}
      })
    })
  })

  describe('action creator subscriptionExclusionPatternsRemoved', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionExclusionPatternsRemoved())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(subscriptionExclusionPatternsRemoved('expected subscription uuid', 'expected pattern uuid'))

      expect(store.getActions()[0]).toContainActionData({
        subscriptionUuid: 'expected subscription uuid',
        uuid: 'expected pattern uuid'
      })
    })
  })

  describe('action creator removeSubscriptionExclusionPattern', () => {

    it('should contain expected action type', () => {
      store.dispatch(removeSubscriptionExclusionPattern())

      expect(store.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS'])
    })

    it('should contain expected patch action type', () => {
      store.dispatch(removeSubscriptionExclusionPattern('1', '2'))

      expect(store.getActions()[0]).toContainActionData({url: 'api/2/exclusions/1/pattern/2'})
    })

    it('should dispatch actions defined in success property', () => {
      store.dispatch(removeSubscriptionExclusionPattern('1', '2'))
      const success = store.getActions()[0].success
      store.clearActions()
      store.dispatch(success({content: [{pattern: 'a'}, {pattern: 'b'}]}))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED'])
      expect(store.getActions()[0]).toContainActionData({subscriptionUuid: '1', uuid: '2'})
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

  describe('action creator saveSubscribeEditForm', () => {

    it('should dispatch expected action', () => {
      const success = () => ({})
      const error = () => ({})
      const finalize = () => ({})

      expect(saveSubscribeEditForm({subscription: {origin: 'url'}, success, error, finalize})).toEqual({
        type: 'POST_SUBSCRIPTION',
        url: 'api/2/subscriptions',
        body: {
          origin: 'url'
        },
        success,
        error,
        finalize
      })
    })
  })
})
