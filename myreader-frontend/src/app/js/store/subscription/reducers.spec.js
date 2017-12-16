import {initialState} from './index'
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
})
