import {getEntries} from './selectors'

describe('src/app/js/store/entry/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            entry: {
                entries: [{uuid: 1}, {uuid: 2}],
                links: {
                    self: {path: 'path1', query: {a: 'b'}},
                    next: {path: 'path2'}
                },
                entryInFocus: 1
            }
        }
    })

    it('should return entries and links', () =>
        expect(getEntries(() => state))
            .toContainObject({
                entries: [{uuid: 1}, {uuid: 2}],
                links: {
                    self: {path: 'path1', query: {a: 'b'}},
                    next: {path: 'path2'}
                }
            })
    )

    it('should return copy of entries', () => {
        const select = getEntries(() => state)
        select.entries[0].key = 'value'

        expect(getEntries(() => state).entries[0]).toEqual({uuid: 1})
    })

    it('should return copy of links', () => {
        const select = getEntries(() => state).links.self
        select.path = 'other'
        select.query.a = 'c'

        expect(getEntries(() => state).links.self).toEqual({path: 'path1', query: {a: 'b'}})
    })

    it('should return entry in focus', () =>
        expect(getEntries(() => state).entryInFocus).toEqual(1))

    it('should return next focusable entry', () =>
        expect(getEntries(() => state).nextFocusableEntry).toEqual(2))

    it('should return null when next focusable entry is not available', () => {
        state.entry.entryInFocus = 2
        expect(getEntries(() => state).nextFocusableEntry).toEqual(null)
    })

    it('should return first entry as next focusable entry when currently no entry is in focus', () => {
        state.entry.entryInFocus = null
        expect(getEntries(() => state).nextFocusableEntry).toEqual(1)
    })

    it('should return null a next focusable entry when entries not available', () => {
        state.entry.entryInFocus = null
        state.entry.entries = []
        expect(getEntries(() => state).nextFocusableEntry).toEqual(null)
    })
})
