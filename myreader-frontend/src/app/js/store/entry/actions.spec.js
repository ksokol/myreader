import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {entryChanged, entryClear, entryFocusNext, entryFocusPrevious, entryPageReceived} from 'store'
import initialState from '.'

describe('src/app/js/store/entry/actions.spec.js', () => {

    let store, mockStore

    beforeEach(() => {
        mockStore = configureMockStore([thunk])
        store = mockStore({entry: initialState()})
    })

    describe('ENTRY_PAGE_RECEIVED', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryPageReceived())
            expect(store.getActions()[0]).toEqualActionType('ENTRY_PAGE_RECEIVED')
        })

        it('should return valid object when input is undefined', () => {
            store.dispatch(entryPageReceived())
            expect(store.getActions()[0]).toContainActionData({entries: [], links: {}})
        })

        it('should return expected action data', () => {
            store.dispatch(entryPageReceived({content: [{key: 'value'}], links: [{rel: 'self', href: 'expected?a=b'}]}))
            expect(store.getActions()[0])
                .toContainActionData({
                    entries: [{key: 'value'}],
                    links: {
                        self: {
                            path: 'expected',
                            query: {a: 'b'}
                        }
                    }
                })
        })
    })

    describe('ENTRY_CHANGED', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryChanged({uuid: '1'}))
            expect(store.getActions()[0]).toEqualActionType('ENTRY_CHANGED')
        })

        it('should not dispatch action when input is undefined', () => {
            store.dispatch(entryChanged())
            expect(store.getActions()[0]).toEqual(undefined)
        })

        it('should return expected action data', () => {
            const state = initialState()
            state.entries = [{uuid: '1', key: 'old value'}]
            store = mockStore({entry: state})

            store.dispatch(entryChanged({uuid: '1', key: 'new value'}))
            expect(store.getActions()[0])
                .toContainActionData({newValue: {uuid: '1', key: 'new value'}, oldValue: {uuid: '1', key: 'old value'}})
        })
    })

    describe('ENTRY_CLEAR', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryClear())
            expect(store.getActions()[0]).toEqualActionType('ENTRY_CLEAR')
        })
    })

    describe('ENTRY_FOCUS_NEXT', () => {

        it('should contain expected action type', () => {
            store.dispatch(entryFocusNext())
            expect(store.getActions()[0]).toEqualActionType('ENTRY_FOCUS_NEXT')
        })

        it('should return expected action data', () => {
            const state = initialState()
            state.entryInFocus = 1
            store = mockStore({entry: state})

            store.dispatch(entryFocusNext())
            expect(store.getActions()[0]).toContainActionData({currentInFocus: 1})
        })
    })

    describe('ENTRY_FOCUS_PREVIOUS', () => {

        it('should not dispatch action when no entry focused', () => {
            store.dispatch(entryFocusPrevious())
            expect(store.getActions()[0]).toEqual(undefined)
        })

        it('should contain expected action type', () => {
            const state = initialState()
            state.entryInFocus = 1
            store = mockStore({entry: state})

            store.dispatch(entryFocusPrevious())
            expect(store.getActions()[0]).toEqualActionType('ENTRY_FOCUS_PREVIOUS')
        })

        it('should return expected action data', () => {
            const state = initialState()
            state.entryInFocus = 1
            store = mockStore({entry: state})

            store.dispatch(entryFocusPrevious())
            expect(store.getActions()[0]).toContainActionData({currentInFocus: 1})
        })
    })
})
