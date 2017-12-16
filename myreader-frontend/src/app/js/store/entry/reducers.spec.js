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
            const action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 3}}},
                entries: [2]
            }

            const currentState = {
                links: {self: {path: 'expected path', query: {next: 2}}},
                entries: [1]
            }

            const expectedState = {
                links: {self: {path: 'expected path', query: {next: 3}}},
                entries: [1, 2]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should set entries and links when links differ', () => {
            const action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}},
                entries: [3]
            }

            const currentState = {
                links: {self: {path: 'expected path', query: {next: 2}}},
                entries: [1]
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
            const action = {
                type: 'SECURITY_UPDATE',
                authorized: false
            }

            const currentState = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {path: 'expected path'},
                entries: [1]
            }

            const expectedState = {
                links: {},
                entries: []
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should do nothing when authorized', () => {
            const action = {
                type: 'SECURITY_UPDATE',
                authorized: true
            }

            const currentState = {
                links: {path: 'expected path'},
                entries: [1]
            }

            const expectedState = {
                links: {path: 'expected path'},
                entries: [1]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_UPDATED', () => {

        it('', () => {
            const action = {
                type: 'ENTRY_UPDATED',
                entry: {uuid: 2, seen: true}
            }

            const currentState = {
                entries: [
                    {uuid: 1, seen: false}
                ]
            }

            expect(entryReducers(currentState, action)).toContainObject(currentState)
        })

        it('', () => {
            const action = {
                type: 'ENTRY_UPDATED',
                entry: {uuid: 2, seen: true}
            }

            const currentState = {
                entries: [
                    {uuid: 1, seen: false},
                    {uuid: 2, seen: false}
                ]
            }

            const expectedState = {
                entries: [
                    {uuid: 1, seen: false},
                    {uuid: 2, seen: true}
                ]
            }

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
