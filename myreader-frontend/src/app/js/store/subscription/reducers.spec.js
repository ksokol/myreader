import initialState from '.'
import {subscriptionReducers} from './reducers'

describe('src/app/js/store/subscription/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(subscriptionReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state))

    describe('action SUBSCRIPTIONS_RECEIVED', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'SUBSCRIPTIONS_RECEIVED',
                subscriptions: [1]
            }
        })

        it('should set subscriptions', () => {
            const expectedState = {subscriptions: [1]}

            expect(subscriptionReducers(state, action)).toContainObject(expectedState)
        })
    })

    describe('action SECURITY_UPDATE', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'SECURITY_UPDATE',
                authorized: false
            }
        })


        it('should reset state when not authorized', () => {
            const currentState = {other: 'expected'}

            expect(subscriptionReducers(currentState, action)).toContainObject(initialState())
        })

        it('should do nothing when authorized', () => {
            action.authorized = true

            const currentState = {other: 'expected'}
            const expectedState = {other: 'expected'}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_CHANGED', () => {

        let action

        beforeEach(() => {
            state = {
                subscriptions: [{uuid: '1', unseen: 2}, {uuid: '2', unseen: 3}]
            }

            action = {
                type: 'ENTRY_CHANGED'
            }
        })

        it('should decrease unseen count', () => {
            action.newValue = {feedUuid: '1', seen: true}
            action.oldValue = {feedUuid: '1', seen: false}

            expect(subscriptionReducers(state, action))
                .toContainObject({subscriptions: [{uuid: '1', unseen: 1}, {uuid: '2', unseen: 3}]})
        })

        it('should increase unseen count', () => {
            action.newValue = {feedUuid: '1', seen: false}
            action.oldValue = {feedUuid: '1', seen: true}

            expect(subscriptionReducers(state, action))
                .toContainObject({subscriptions: [{uuid: '1', unseen: 3}, {uuid: '2', unseen: 3}]})
        })

        it('should do nothing when seen flag not changed', () => {
            action.newValue = {feedUuid: '1', seen: false}
            action.oldValue = {feedUuid: '1', seen: false}

            expect(subscriptionReducers(state, action))
                .toContainObject({subscriptions: [{uuid: '1', unseen: 2}]})
        })

        it('should do nothing when subscription is not available', () => {
            action.newValue = {feedUuid: '3', seen: false}
            action.oldValue = {feedUuid: '3', seen: false}

            expect(subscriptionReducers(state, action))
                .toContainObject({subscriptions: [{uuid: '1', unseen: 2}, {uuid: '2', unseen: 3}]})
        })
    })

    describe('action SUBSCRIPTION_DELETED', () => {

        it('should remove subscription for given uuid', () => {
            const state = {subscriptions: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}]}
            const action = {type: 'SUBSCRIPTION_DELETED', uuid: '2'}

            expect(subscriptionReducers(state, action)).toContainObject({subscriptions: [{uuid: '1'}, {uuid: '3'}]})
        })
    })

    describe('SUBSCRIPTION_SAVED', () => {

        const action = uuid => {
            return {
                type: 'SUBSCRIPTION_SAVED',
                subscription: {uuid, title: 'new title'}
            }
        }

        beforeEach(() => {
            state = {
                subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}]
            }
        })

        it('should not update subscription when not in store', () => {
            expect(subscriptionReducers(state, action('3')))
                .toContainObject({subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}]})
        })

        it('should update subscription when in store', () => {
            expect(subscriptionReducers(state, action('2')))
                .toContainObject({subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'new title'}]})
        })
    })
})
