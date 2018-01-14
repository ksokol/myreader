import {
    addSubscriptionExclusionPattern, deleteSubscription, fetchSubscriptionExclusionPatterns, fetchSubscriptions,
    fetchSubscriptionTags, removeSubscriptionExclusionPattern, saveSubscription, subscriptionDeleted,
    subscriptionExclusionPatternsAdded, subscriptionExclusionPatternsReceived, subscriptionExclusionPatternsRemoved,
    subscriptionSaved, subscriptionsReceived, subscriptionTagsReceived
} from 'store'
import {createMockStore} from '../../shared/test-utils'

describe('src/app/js/store/subscription/actions.spec.js', () => {

    let store

    beforeEach(() => store = createMockStore())

    describe('SUBSCRIPTIONS_RECEIVED', () => {

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

    describe('action creator fetchSubscriptions()', () => {

        it('should use HTTP verb GET as type', () => {
            store.dispatch(fetchSubscriptions())
            expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTIONS'])
        })

        it('should fetch all subscriptions', () => {
            store.dispatch(fetchSubscriptions())
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions'})
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

    describe('SUBSCRIPTION_DELETED', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionDeleted('1'))
            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_DELETED'])
        })

        it('should return expected action data', () => {
            store.dispatch(subscriptionDeleted('1'))
            expect(store.getActions()[0]).toContainActionData({uuid: '1'})
        })
    })

    describe('action creator deleteSubscription()', () => {

        it('should contain expected action type', () => {
            store.dispatch(deleteSubscription('1'))
            expect(store.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION'])
        })

        it('should return expected action data', () => {
            store.dispatch(deleteSubscription('uuid1'))
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions/uuid1'})
        })

        it('should dispatch actions defined in success property', () => {
            store.dispatch(deleteSubscription('uuid1'))
            const success = store.getActions()[0].success
            store.clearActions()
            success.forEach(action => store.dispatch(action({uuid: '1'})))

            expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION', 'SUBSCRIPTION_DELETED'])
            expect(store.getActions()[0]).toContainActionData({notification: {text: 'Subscription deleted', type: 'success'}})
            expect(store.getActions()[1]).toContainObject({type: 'SUBSCRIPTION_DELETED', uuid: 'uuid1'})
        })
    })

    describe('SUBSCRIPTION_SAVED', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionSaved({uuid: '1', title: 'expected title'}))
            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_SAVED'])
        })

        it('should return expected action data', () => {
            store.dispatch(subscriptionSaved({uuid: '1', title: 'expected title'}))
            expect(store.getActions()[0]).toContainActionData({subscription: {uuid: '1', title: 'expected title'}})
        })

        it('should return copy of subscription', () => {
            const raw = {uuid: '1', title: 'expected title'}
            const subscription = subscriptionSaved(raw).subscription
            raw.title = 'other title'

            expect(subscription).toEqual({uuid: '1', title: 'expected title'})
        })
    })

    describe('action creator saveSubscription', () => {

        it('should contain expected post action type', () => {
            store.dispatch(saveSubscription({}))

            expect(store.getActionTypes()).toEqual(['POST_SUBSCRIPTION'])
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions'})
        })

        it('should contain expected patch action type', () => {
            store.dispatch(saveSubscription({uuid: '1'}))

            expect(store.getActionTypes()).toEqual(['PATCH_SUBSCRIPTION'])
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions/1'})
        })

        it('should return expected action data', () => {
            store.dispatch(saveSubscription({uuid: '1', title: 'expected title'}))

            expect(store.getActions()[0]).toContainActionData({body: {uuid: '1', title: 'expected title'}})
        })

        it('should dispatch actions defined in success property', () => {
            store.dispatch(saveSubscription({uuid: '1', title: 'expected title'}))
            const success = store.getActions()[0].success
            store.clearActions()
            success.forEach(action => store.dispatch(action({uuid: '1', title: 'expected updated title'})))

            expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION', 'SUBSCRIPTION_SAVED'])
            expect(store.getActions()[0]).toContainActionData({notification: {text: 'Subscription saved', type: 'success'}})
            expect(store.getActions()[1]).toContainActionData({subscription: {uuid: '1', title: 'expected updated title'}})
        })
    })

    describe('action creator subscriptionTagsReceived', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionTagsReceived([]))

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_TAGS_RECEIVED'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(subscriptionTagsReceived(['tag1', 'tag2']))

            expect(store.getActions()[0]).toContainActionData({tags: ['tag1', 'tag2']})
        })
    })

    describe('action creator fetchSubscriptionTags', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchSubscriptionTags())

            expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION_TAGS'])
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions/availableTags'})
        })

        it('should dispatch actions defined in success property', () => {
            store.dispatch(fetchSubscriptionTags())
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success(['tag1', 'tag2']))

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_TAGS_RECEIVED'])
            expect(store.getActions()[0]).toContainActionData({tags: ['tag1', 'tag2']})
        })
    })

    describe('action creator subscriptionExclusionPatternsReceived', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionExclusionPatternsReceived())

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(subscriptionExclusionPatternsReceived('expected uuid', {content: [{pattern: 'a'}, {pattern: 'b'}]}))

            expect(store.getActions()[0]).toContainActionData({subscriptionUuid: 'expected uuid', patterns: [{pattern: 'a'}, {pattern: 'b'}]})
        })
    })

    describe('action creator fetchSubscriptionExclusionPatterns', () => {

        it('should contain expected action type', () => {
            store.dispatch(fetchSubscriptionExclusionPatterns())

            expect(store.getActionTypes()).toEqual(['GET_SUBSCRIPTION_EXCLUSION_PATTERNS'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(fetchSubscriptionExclusionPatterns('expected uuid'))

            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/exclusions/expected uuid/pattern'})
        })

        it('should dispatch actions defined in success property', () => {
            store.dispatch(fetchSubscriptionExclusionPatterns('expected uuid'))
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success({content: [{pattern: 'a'}, {pattern: 'b'}]}))

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED'])
            expect(store.getActions()[0]).toContainActionData({subscriptionUuid: 'expected uuid', patterns: [{pattern: 'a'}, {pattern: 'b'}]})
        })
    })

    describe('action creator subscriptionExclusionPatternsAdded', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionExclusionPatternsAdded())

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(subscriptionExclusionPatternsAdded('expected subscription uuid', {uuid: '1', hitCount: 0, pattern: 'a'}))

            expect(store.getActions()[0])
                .toContainActionData({subscriptionUuid: 'expected subscription uuid', pattern: {uuid: '1', hitCount: 0, pattern: 'a'}})
        })
    })

    describe('action creator addSubscriptionExclusionPattern', () => {

        it('should contain expected action type', () => {
            store.dispatch(addSubscriptionExclusionPattern())

            expect(store.getActionTypes()).toEqual(['POST_SUBSCRIPTION_EXCLUSION_PATTERN'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(addSubscriptionExclusionPattern('1', 'expected pattern'))

            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/exclusions/1/pattern'})
            expect(store.getActions()[0]).toContainActionData({body: {pattern: 'expected pattern'}})
        })

        it('should dispatch actions defined in success property', () => {
            store.dispatch(addSubscriptionExclusionPattern('1'))
            const success = store.getActions()[0].success
            store.clearActions()
            store.dispatch(success({uuid: '2', hitCount: 0, pattern: 'a'}))

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED'])
            expect(store.getActions()[0]).toContainActionData({subscriptionUuid: '1', pattern: {uuid: '2', hitCount: 0, pattern: 'a'}})
        })
    })

    describe('action creator subscriptionExclusionPatternsRemoved', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionExclusionPatternsRemoved())

            expect(store.getActionTypes()).toEqual(['SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(subscriptionExclusionPatternsRemoved('expected subscription uuid', 'expected pattern uuid'))

            expect(store.getActions()[0]).toContainActionData({subscriptionUuid: 'expected subscription uuid', uuid: 'expected pattern uuid'})
        })
    })

    describe('action creator removeSubscriptionExclusionPattern', () => {

        it('should contain expected action type', () => {
            store.dispatch(removeSubscriptionExclusionPattern())

            expect(store.getActionTypes()).toEqual(['DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS'])
        })

        it('should contain expected patch action type', () => {
            store.dispatch(removeSubscriptionExclusionPattern('1', '2'))

            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/exclusions/1/pattern/2'})
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
})
