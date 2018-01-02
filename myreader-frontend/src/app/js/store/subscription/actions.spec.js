import {
    deleteSubscription,
    fetchSubscriptions,
    saveSubscription,
    subscriptionDeleted,
    subscriptionSaved,
    subscriptionsReceived
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

        it('should dispatch SUBSCRIPTION_DELETED action on success', () => {
            store.dispatch(deleteSubscription('uuid1'))
            store.dispatch(store.getActions()[0].success())
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
})
