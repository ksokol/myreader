import initialState from '.'
import {subscriptionReducers} from 'store'

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

        const action = subscription => {
            return {
                type: 'SUBSCRIPTION_SAVED',
                subscription
            }
        }

        beforeEach(() => {
            state = {
                subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}]
            }
        })

        it('should update subscription in store when in store', () => {
            expect(subscriptionReducers(state, action({uuid: '2', title: 'new title'})))
                .toContainObject({subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'new title'}]})
        })

        it('should add subscription to store when not in store', () => {
            expect(subscriptionReducers(state, action({uuid: '3', title: 'title3'})))
                .toContainObject({subscriptions: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}, {uuid: '3', title: 'title3'}]})
        })
    })

    describe('action SUBSCRIPTION_TAGS_RECEIVED', () => {

        it('should set tags', () => {
            const action = {
                type: 'SUBSCRIPTION_TAGS_RECEIVED',
                tags: ['tag1', 'tag2']
            }

            const currentState = {tags: []}
            const expectedState = {tags: ['tag1', 'tag2']}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED', () => {

        const action = {
            type: 'SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED',
            subscriptionUuid: '1',
            patterns: [1, 2]
        }

        it('should set exclusions', () => {
            const currentState = {exclusions: []}
            const expectedState = {exclusions: {'1': [1, 2]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should append exclusions', () => {
            const currentState = {exclusions: {'2': [3, 4]}}
            const expectedState = {exclusions: {'1': [1, 2], '2': [3, 4]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED', () => {

        const action = {
            type: 'SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED',
            subscriptionUuid: '1',
            pattern: {uuid: '2'}
        }

        it('should add subscription exclusion patterns', () => {
            const currentState = {exclusions: {'2': [{uuid: '3'}, {uuid: '4'}]}}
            const expectedState = {exclusions: {'2': [{uuid: '3'}, {uuid: '4'}], '1': [{uuid: '2'}]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should add new exclusion pattern to subscription', () => {
            const currentState = {exclusions: {'1': [{uuid: '1'}]}}
            const expectedState = {exclusions: {'1': [{uuid: '1'}, {uuid: '2'}]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should update existing exclusion pattern for subscription', () => {
            const currentState = {exclusions: {'1': [{uuid: '2', pattern: 'p2'}]}}
            const expectedState = {exclusions: {'1': [{uuid: '2', pattern: 'expected'}]}}

            expect(subscriptionReducers(currentState, {...action, pattern: {uuid: '2', pattern: 'expected'}}))
                .toContainObject(expectedState)
        })

        it('should sort exclusion patterns', () => {
            const currentState = {exclusions: {'1': [{uuid: '1', pattern: 'p1'}, {uuid: '2', pattern: 'p2'}]}}
            const expectedState = {exclusions: {'1': [{uuid: '2', pattern: 'a'}, {uuid: '1', pattern: 'p1'}]}}

            expect(subscriptionReducers(currentState, {...action, pattern: {uuid: '2', pattern: 'a'}}))
                .toContainObject(expectedState)
        })
    })

    describe('action SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED', () => {

        const action = {
            type: 'SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED',
            subscriptionUuid: '1',
            uuid: 2
        }

        it('should remove exclusion pattern', () => {
            const currentState = {exclusions: {'1': [{uuid: '1'}, {uuid: '2'}], '2': [{uuid: '3'}, {uuid: '4'}]}}
            const expectedState = {exclusions: {'1': [{uuid: '1'}], '2': [{uuid: '3'}, {uuid: '4'}]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should not remove exclusion pattern when exclusion pattern is not present in store', () => {
            const currentState = {exclusions: {'1': [{uuid: '1'}, {uuid: '3'}]}}
            const expectedState = {exclusions: {'1': [{uuid: '1'}, {uuid: '3'}]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should not remove exclusion pattern when exclusion patterns for subscription are not present in store', () => {
            const currentState = {exclusions: {'2': [{uuid: '1'}, {uuid: '2'}]}}
            const expectedState = {exclusions: {'2': [{uuid: '1'}, {uuid: '2'}]}}

            expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
