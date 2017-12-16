import {getEntries} from './selectors'

describe('src/app/js/store/entry/selectors.spec.js', () => {

    const state = {
        entry: {
            entries: [{uuid: 1}, {uuid: 2}],
            links: {
                self: {path: 'path1', query: {a: 'b'}},
                next: {path: 'path2'}
            }
        }
    }

    it('should return entries and links', () =>
        expect(getEntries(() => state))
            .toEqual({
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
})
