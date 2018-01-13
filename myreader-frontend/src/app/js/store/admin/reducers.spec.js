import initialState from '.'
import {adminReducers} from 'store'

describe('src/app/js/store/admin/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(adminReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state))

    describe('action APPLICATION_INFO_RECEIVED', () => {

        it('should do nothing when no entry focused', () => {
            const action = {
                type: 'APPLICATION_INFO_RECEIVED',
                applicationInfo: {a: 'b', c: 'd'}
            }

            const currentState = {applicationInfo: {}}
            const expectedState = {applicationInfo: {a: 'b', c: 'd'}}

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
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
            const currentState = {applicationInfo: {a: 'b'}}

            expect(adminReducers(currentState, action)).toContainObject(initialState())
        })

        it('should do nothing when authorized', () => {
            action.authorized = true

            const currentState = {applicationInfo: {a: 'b'}}
            const expectedState = {applicationInfo: {a: 'b'}}

            expect(adminReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
