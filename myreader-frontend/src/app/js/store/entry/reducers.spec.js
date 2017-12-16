import {initialState} from './index'
import {entryReducers} from './reducers'

describe('src/app/js/store/entry/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () =>
        expect(entryReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state))

    describe('action ENTRY_PAGE_RECEIVED', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'ENTRY_PAGE_RECEIVED',
                links: {self: {path: 'expected path'}},
                entries: [1]
            }
        })

        it('should set entries and links', () => {
            const expectedState = {links: {self: {path: 'expected path'}}, entries: [1]}

            expect(entryReducers(state, action)).toContainObject(expectedState)
        })

        it('should update entries and links', () => {
            action.links = {self: {path: 'expected path', query: {next: 3}}}
            action.entries = [2]

            const currentState = {links: {self: {path: 'expected path', query: {next: 2}}}, entries: [1]}
            const expectedState = {links: {self: {path: 'expected path', query: {next: 3}}}, entries: [1, 2]}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should set entries and links when links differ', () => {
            action.links = {self: {path: 'expected path', query: {next: 2, a: 'b'}}}
            action.entries = [3]

            const currentState = {links: {self: {path: 'expected path', query: {next: 2}}}, entries: [1]}
            const expectedState = {links: {self: {path: 'expected path', query: {next: 2, a: 'b'}}}, entries: [3]}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
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

        it('should reset entries and links when not authorized', () => {
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
            action.authorized = true

            const currentState = {links: {path: 'expected path'}, entries: [1]}
            const expectedState = {links: {path: 'expected path'}, entries: [1]}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_UPDATED', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'ENTRY_UPDATED',
                entry: {uuid: 2, seen: true}
            }
        })

        it('should set seen flag to false', () => {
            const currentState = {entries: [{uuid: 1, seen: false}]}

            expect(entryReducers(currentState, action)).toContainObject(currentState)
        })

        it('should set seen flag to false for given entry', () => {
            action.entry = {uuid: 2, seen: true}

            const currentState = {entries: [{uuid: 1, seen: false}, {uuid: 2, seen: false}]}
            const expectedState = {entries: [{uuid: 1, seen: false}, {uuid: 2, seen: true}]}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_CLEAR', () => {

        it('should clear entries and links', () => {
            const action = {type: 'ENTRY_CLEAR'}

            const currentState = {links: {path: 'expected path'}, entries: [1]}
            const expectedState = {links: {}, entries: []}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_FOCUS_NEXT', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'ENTRY_FOCUS_NEXT',
                currentInFocus: null
            }
        })

        it('should mark first entry as focused', () => {
            const currentState = {entries: [{uuid: 1}], entryInFocus: null}
            const expectedState = {entryInFocus: 1}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should mark second entry as focused', () => {
            action.currentInFocus = 1

            const currentState = {entries: [{uuid: 2}], entryInFocus: 1}
            const expectedState = {entryInFocus: 2}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should do nothing when last entry focused', () => {
            action.currentInFocus = 1

            const currentState = {entries: [{uuid: 1}], entryInFocus: 1}
            const expectedState = {entryInFocus: 1}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })

    describe('action ENTRY_FOCUS_PREVIOUS', () => {

        let action

        beforeEach(() => {
            action = {
                type: 'ENTRY_FOCUS_PREVIOUS',
                currentInFocus: null
            }
        })

        it('should do nothing when no entry focused', () => {
            const currentState = {entries: [{uuid: 1}], entryInFocus: null}
            const expectedState = {entryInFocus: null}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should mark first entry as focused', () => {
            action.currentInFocus = 2

            const currentState = {entries: [{uuid: 1}, {uuid: 2}], entryInFocus: 2}
            const expectedState = {entryInFocus: 1}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })

        it('should mark no entry as focused', () => {
            action.currentInFocus = 1

            const currentState = {entries: [{uuid: 1}], entryInFocus: 1}
            const expectedState = {entryInFocus: null}

            expect(entryReducers(currentState, action)).toContainObject(expectedState)
        })
    })
})
