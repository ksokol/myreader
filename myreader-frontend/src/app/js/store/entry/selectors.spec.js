import {getEntries, getEntry} from 'store'

describe('src/app/js/store/entry/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            entry: {
                entries: [{uuid: '1'}, {uuid: '2'}],
                links: {
                    self: {path: 'path1', query: {a: 'b'}},
                    next: {path: 'path2'}
                },
                entryInFocus: '1'
            }
        }
    })

    it('should return entries and links', () =>
        expect(getEntries(state))
            .toContainObject({
                entries: [{uuid: '1'}, {uuid: '2'}],
                links: {
                    self: {path: 'path1', query: {a: 'b'}},
                    next: {path: 'path2'}
                }
            })
    )

    it('should return copy of entries', () => {
        const select = getEntries(state)
        select.entries[0].key = 'value'

        expect(getEntries(state).entries[0]).toEqual({uuid: '1'})
    })

    it('should return copy of links', () => {
        const select = getEntries(state).links.self
        select.path = 'other'
        select.query.a = 'c'

        expect(getEntries(state).links.self).toEqual({path: 'path1', query: {a: 'b'}})
    })

    it('should return entry in focus', () =>
        expect(getEntries(state).entryInFocus).toEqual({uuid: '1'}))

    it('should return next focusable entry', () =>
        expect(getEntries(state).nextFocusableEntry).toEqual({uuid: '2'}))

    it('should return empty object when next focusable entry is not available', () => {
        state.entry.entryInFocus = '2'
        expect(getEntries(state).nextFocusableEntry).toEqual({})
    })

    it('should return first entry as next focusable entry when currently no entry is in focus', () => {
        state.entry.entryInFocus = null
        expect(getEntries(state).nextFocusableEntry).toEqual({uuid: '1'})
    })

    it('should return empty object as next focusable entry when entries not available', () => {
        state.entry.entryInFocus = null
        state.entry.entries = []
        expect(getEntries(state).nextFocusableEntry).toEqual({})
    })

    it('should return entry for uuid 1', () => {
        expect(getEntry('1', state)).toEqual({uuid: '1'})
    })

    it('should return undefined when entry for uuid 3 is not available', () => {
        expect(getEntry('3', state)).toEqual(undefined)
    })

    it('should return copy of entry', () => {
        const actual = getEntry('1', state)
        actual.key = 'value'
        expect(state.entry.entries[0]).toEqual({uuid: '1'})
    })
})
