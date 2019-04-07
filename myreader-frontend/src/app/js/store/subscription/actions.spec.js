import {
  addSubscriptionExclusionPattern,
  clearSubscriptionEditForm,
  deleteSubscription,
  fetchSubscriptionExclusionPatterns,
  fetchSubscriptions,
  loadSubscriptionIntoEditForm,
  removeSubscriptionExclusionPattern,
  saveSubscribeEditForm,
  saveSubscriptionEditForm,
  saveSubscriptionTag,
  subscriptionDeleted,
  subscriptionEditFormChangeData,
  subscriptionEditFormSaved,
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
      store.dispatch(deleteSubscription('1'))
      expect(store.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION'])
    })

    it('should return expected action data', () => {
      store.dispatch(deleteSubscription('uuid1'))
      expect(store.getActions()[0].url).toEqual('api/2/subscriptions/uuid1')
    })

    it('should dispatch actions defined in before property', () => {
      store.dispatch(deleteSubscription('uuid1').before())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGING'])
    })

    it('should dispatch actions defined in success property', () => {
      store.dispatch(deleteSubscription('uuid1'))
      const success = store.getActions()[0].success
      store.clearActions()
      success.forEach(action => store.dispatch(action({uuid: '1'})))

      expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION', 'SUBSCRIPTION_DELETED', 'ROUTE_CHANGED'])
      expect(store.getActions()[0]).toContainActionData({notification: {text: 'Subscription deleted', type: 'success'}})
      expect(store.getActions()[1]).toContainObject({type: 'SUBSCRIPTION_DELETED', uuid: 'uuid1'})
      expect(store.getActions()[2]).toContainObject({route: ['app', 'subscriptions']})
    })

    it('should dispatch actions defined in finalize property', () => {
      store.dispatch(deleteSubscription('uuid1').finalize())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGED'])
    })
  })

  describe('action creator subscriptionEditFormSaved', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionEditFormSaved({uuid: '1', title: 'expected title'}))
      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_SAVED'])
    })

    it('should return expected action data', () => {
      store.dispatch(subscriptionEditFormSaved({uuid: '1', title: 'expected title', feedTag: null}))
      expect(store.getActions()[0]).toContainActionData({
        data: {
          uuid: '1',
          title: 'expected title',
          feedTag: {
            name: undefined,
            color: undefined
          }
        }
      })
    })

    it('should return copy of subscription', () => {
      const raw = {uuid: '1', title: 'expected title'}
      const subscription = subscriptionEditFormSaved(raw).data
      raw.title = 'other title'

      expect(subscription).toContainObject({uuid: '1', title: 'expected title'})
    })
  })

  describe('action creator saveSubscriptionEditForm', () => {

    it('should dispatch actions defined in before property', () => {
      saveSubscriptionEditForm({}).before.forEach(action => store.dispatch(action()))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGING', 'SUBSCRIPTION_EDIT_FORM_VALIDATIONS'])
      expect(store.getActions()[1]).toContainActionData({validations: []})
    })

    it('should contain expected patch action type', () => {
      store.dispatch(saveSubscriptionEditForm({uuid: '1'}))

      expect(store.getActionTypes()).toEqual(['PATCH_SUBSCRIPTION'])
      expect(store.getActions()[0].url).toMatch(/api\/2\/subscriptions\/1$/)
    })

    it('should return expected action data', () => {
      store.dispatch(saveSubscriptionEditForm({uuid: '1', title: 'expected title'}))

      expect(store.getActions()[0]).toContainActionData({body: {uuid: '1', title: 'expected title'}})
    })

    it('should dispatch actions defined in success property', () => {
      const success = saveSubscriptionEditForm({}).success
      success.forEach(action => store.dispatch(action({uuid: '1', title: 'expected updated title', feedTag: null})))

      expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION', 'SUBSCRIPTION_EDIT_FORM_SAVED'])
      expect(store.getActions()[0]).toContainActionData({notification: {text: 'Subscription saved', type: 'success'}})
      expect(store.getActions()[1]).toContainActionData({data: {uuid: '1', title: 'expected updated title', feedTag: {name: undefined, color: undefined}}})
    })

    it('should dispatch actions defined in error property', () => {
      store.dispatch(saveSubscriptionEditForm({}).error({status: 400, fieldErrors: [{a: 'b', c: 'd'}]}))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_VALIDATIONS'])
      expect(store.getActions()[0]).toContainActionData({validations: [{a: 'b', c: 'd'}]})
    })

    it('should not return any error action when status is not 403', () => {
      expect(saveSubscriptionEditForm({}).error({status: 403})).toBeUndefined()
    })

    it('should dispatch actions defined in finalize property', () => {
      store.dispatch(saveSubscriptionEditForm({}).finalize())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGED'])
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

    it('should dispatch actions defined in before property', () => {
      store.dispatch(addSubscriptionExclusionPattern().before())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGING'])
    })

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

    it('should dispatch actions defined in finalize property', () => {
      store.dispatch(addSubscriptionExclusionPattern().finalize())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGED'])
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

    it('should dispatch actions defined in before property', () => {
      store.dispatch(removeSubscriptionExclusionPattern().before())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGING'])
    })

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

    it('should dispatch actions defined in finalize property', () => {
      store.dispatch(removeSubscriptionExclusionPattern().finalize())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGED'])
    })
  })

  describe('action creator clearSubscriptionEditForm', () => {

    it('should contain expected action type', () => {
      store.dispatch(clearSubscriptionEditForm())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CLEAR'])
    })
  })

  describe('action creator loadSubscriptionIntoEditForm', () => {

    it('should fetch subscription by uuid when not in store', () => {
      store.dispatch(loadSubscriptionIntoEditForm())

      expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION'])
    })

    it('should contain expected subscription resource url', () => {
      store.dispatch(loadSubscriptionIntoEditForm('uuid1'))

      expect(store.getActions()[0].url).toMatch(/\/subscriptions\/uuid1$/)
    })

    it('should dispatch load action when subscription fetched', () => {
      store.dispatch(loadSubscriptionIntoEditForm('uuid1'))
      const success = store.getActions()[0].success
      store.clearActions()
      success({uuid: 'uuid1', a: 'b', c: 'd'})

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_LOAD'])
      expect(store.getActions()[0]).toContainActionData({subscription: {uuid: 'uuid1', a: 'b', c: 'd'}})
    })

    it('should dispatch load action when subscription exists in store', () => {
      store.setState({subscription: {subscriptions: [{uuid: 'uuid1'}]}})
      store.dispatch(loadSubscriptionIntoEditForm('uuid1'))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_LOAD'])
    })

    it('should contain subscription in load action', () => {
      store.setState({subscription: {subscriptions: [{uuid: 'uuid1'}, {uuid: 'uuid2'}]}})
      store.dispatch(loadSubscriptionIntoEditForm('uuid1'))

      expect(store.getActions()[0]).toContainActionData({subscription: {uuid: 'uuid1'}})
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

  describe('action creator subscriptionEditFormChangeData', () => {

    it('should contain expected action type', () => {
      store.dispatch(subscriptionEditFormChangeData())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGE_DATA'])
    })

    it('should contain expected action payload', () => {
      store.dispatch(subscriptionEditFormChangeData({a: 'b', c: 'd'}))

      expect(store.getActions()[0]).toContainObject({data: {a: 'b', c: 'd'}})
    })
  })

  describe('action creator saveSubscribeEditForm', () => {

    it('should dispatch actions defined in before property', () => {
      saveSubscribeEditForm({}).before.forEach(action => store.dispatch(action()))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGING', 'SUBSCRIPTION_EDIT_FORM_VALIDATIONS'])
      expect(store.getActions()[1]).toContainActionData({validations: []})
    })

    it('should contain expected post action type', () => {
      store.dispatch(saveSubscribeEditForm({}))

      expect(store.getActionTypes()).toEqual(['POST_SUBSCRIPTION'])
      expect(store.getActions()[0].url).toMatch(/api\/2\/subscriptions$/)
    })

    it('should return expected action data', () => {
      store.dispatch(saveSubscribeEditForm({uuid: '1', title: 'expected title'}))

      expect(store.getActions()[0]).toContainActionData({body: {uuid: '1', title: 'expected title'}})
    })

    it('should dispatch actions defined in success property', () => {
      const success = saveSubscribeEditForm({}).success
      success.forEach(action => store.dispatch(action({uuid: '1'})))

      expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION', 'ROUTE_CHANGED'])
      expect(store.getActions()[0]).toContainActionData({notification: {text: 'Subscribed', type: 'success'}})
      expect(store.getActions()[1]).toContainActionData({route: ['app', 'subscription'], query: {uuid: '1'}})
    })

    it('should dispatch actions defined in error property', () => {
      store.dispatch(saveSubscribeEditForm({}).error({status: 400, fieldErrors: [{a: 'b', c: 'd'}]}))

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_VALIDATIONS'])
      expect(store.getActions()[0]).toContainActionData({validations: [{a: 'b', c: 'd'}]})
    })

    it('should not return any error action when status is not 403', () => {
      expect(saveSubscribeEditForm({}).error({status: 403})).toBeUndefined()
    })

    it('should dispatch actions defined in finalize property', () => {
      store.dispatch(saveSubscribeEditForm({}).finalize())

      expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EDIT_FORM_CHANGED'])
    })
  })
})
