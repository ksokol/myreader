import {fetchSubscriptions, subscriptionsReceived} from 'store'
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

        it('should fetch all subscriptions with at least one new entry', () => {
            store.dispatch(fetchSubscriptions())
            expect(store.getActions()[0]).toContainActionData({url: '/myreader/api/2/subscriptions?unseenGreaterThan=0'})
        })

        it('should fetch all subscriptions', () => {
            store.dispatch(fetchSubscriptions(false))
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
})
