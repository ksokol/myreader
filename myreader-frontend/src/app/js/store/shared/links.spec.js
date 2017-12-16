import {equalLinks, extractLinks} from './links'

describe('src/app/js/store/shared/links.spec.js', () => {

    describe('extractLinks', () => {

        it('should extract self link with path and query parameters', () =>
            expect(extractLinks([{rel: 'self', href: '/context/path?a=b&c=d'}])).toEqual({self: {path: '/context/path', query: {a: 'b', c: 'd'}}}))

        it('should extract self link with path and without query parameters', () =>
            expect(extractLinks([{rel: 'self', href: '/context/path'}])).toEqual({self: {path: '/context/path', query: {}}}))

        it('should extract empty self link', () =>
            expect(extractLinks([{rel: 'self', href: ''}])).toEqual({self: {path: '', query: {}}}))

        it('should extract self link with query parameters', () =>
            expect(extractLinks([{rel: 'self', href: '?a=b'}])).toEqual({self: {path: '', query: {a: 'b'}}}))

        it('should skip invalid link', () =>
            expect(extractLinks([{rel: 'self'}])).toEqual({}))

        it('should return empty object when no links defined', () =>
            expect(extractLinks(undefined)).toEqual({}))

        it('should extract self and other link', () =>
            expect(extractLinks([{rel: 'self', href: 'expected'}, {rel: 'other', href: '/other/path?a=b'}]))
                .toEqual({
                    self: {
                        path: 'expected',
                        query: {}
                    },
                    other: {
                        path: '/other/path',
                        query: {
                            a: 'b'
                        }
                    }

                })
        )
    })

    describe('equalLinks', () => {

        it('should return true when links are empty', () =>
            expect(equalLinks({}, {})).toEqual(true))

        it('should return true when path equals', () =>
            expect(equalLinks({path: 'path'}, {path: 'path'})).toEqual(true))

        it('should return false when path differs', () =>
            expect(equalLinks({path: 'path'}, {path: 'other'})).toEqual(false))

        it('should return false when left link undefined', () =>
            expect(equalLinks(undefined, {path: 'path'})).toEqual(false))

        it('should return false when right link undefined', () =>
            expect(equalLinks({path: 'path'}, undefined)).toEqual(false))

        it('should return false when left query differs from right query', () =>
            expect(equalLinks({query: {a: 'b'}}, {query: {}})).toEqual(false))

        it('should return false when right query differs from left query', () =>
            expect(equalLinks({query: {}}, {query: {a: 'b'}})).toEqual(false))

        it('should return true when empty query equals', () =>
            expect(equalLinks({query: {}}, {query: {}})).toEqual(true))

        it('should return false when left query keys differ from right query keys', () =>
            expect(equalLinks({query: {a: 'b'}}, {query: {c: 'd'}})).toEqual(false))

        it('should return false when right query keys differ from left query keys', () =>
            expect(equalLinks({query: {c: 'd'}}, {query: {a: 'b'}})).toEqual(false))

        it('should return false when left query values differ from right query values', () =>
            expect(equalLinks({query: {a: 'b'}}, {query: {a: 'c'}})).toEqual(false))

        it('should return false when right query values differ from left query values', () =>
            expect(equalLinks({query: {a: 'c'}}, {query: {a: 'b'}})).toEqual(false))

        it('should return true when query equals', () =>
            expect(equalLinks({query: {a: 'b'}}, {query: {a: 'b'}})).toEqual(true))

        it('should return true when query equals ignoring key', () =>
            expect(equalLinks({query: {a: 'b', c: 'd'}}, {query: {a: 'b', c: 'e'}}, ['c'])).toEqual(true))

        it('should return true when query equals ignoring undefined key', () =>
            expect(equalLinks({query: {a: 'b', c: 'd'}}, {query: {a: 'b', c: 'd'}}, ['e'])).toEqual(true))

        it('should return false when query differs ignoring key', () =>
            expect(equalLinks({query: {a: 'b', c: 'd'}}, {query: {a: 'f', c: 'e'}}, ['c'])).toEqual(false))

        it('should return true when multiple query parameters equal', () =>
            expect(equalLinks({query: {a: 'b', c: 'd'}}, {query: {a: 'b', c: 'd'}})).toEqual(true))

        it('should return true when unordered multiple query parameters equal', () =>
            expect(equalLinks({query: {c: 'd', a: 'b'}}, {query: {a: 'b', c: 'd'}})).toEqual(true))
    })
})
