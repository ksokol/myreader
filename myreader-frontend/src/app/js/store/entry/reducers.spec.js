import {initialState} from './index'
import {entryReducers} from './reducers'

describe('src/app/js/store/entry/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(entryReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state))

    describe('action ENTRY_PAGE_RECEIVED', () => {

        it('should set entries and links', () => {
            const action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path'}},
                entries: [1]
            }

            const expectedState = {
                links: {self: {path: 'expected path'}},
                entries: [1]
            }

            expect(entryReducers(state, action)).toContainObject(expectedState)
        })

        it('should update entries and links', () => {
            let action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 2}}},
                entries: [1]
            }

            const currentState = entryReducers(state, action)

            action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 3}}},
                entries: [2]
            }

            const expectedState = {
                links: {self: {path: 'expected path', query: {next: 3}}},
                entries: [1, 2]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should set entries and links when links differ', () => {
            let action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 2}}},
                entries: [1]
            }

            const currentState = entryReducers(state, action)

            action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}},
                entries: [3]
            }

            const expectedState = {
                links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}},
                entries: [3]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action SECURITY_UPDATE', () => {

        it('should reset entries and links when not authorized', () => {
            let action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {path: 'expected path'},
                entries: [1]
            }

            const currentState = entryReducers(state, action)

            action = {
                type: 'SECURITY_UPDATE',
                authorized: false
            }

            const expectedState = {
                links: {},
                entries: []
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should do nothing when authorized', () => {
            let action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {path: 'expected path'},
                entries: [1]
            }

            const currentState = entryReducers(state, action)

            action = {
                type: 'SECURITY_UPDATE',
                authorized: true
            }

            const expectedState = {
                links: {path: 'expected path'},
                entries: [1]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
