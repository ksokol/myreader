import {toEntries} from './entry'

describe('src/app/js/store/entry/converter.spec.js', () => {

    it('should convert raw data', () => {
        const raw = {
            links: [
                {
                    rel: 'self',
                    href: '/path1?a=b'
                }, {
                    rel: 'next',
                    href: '/path2?c=d'
                }
            ],
            content: [1, 2, 3]
        }

        expect(toEntries(raw))
            .toEqual({
                links: {
                    self: {
                        path: '/path1',
                        query: {
                            a: 'b'
                        }
                    },
                    next: {
                        path: '/path2',
                        query: {
                            c: 'd'
                        }
                    },
                },
                entries: [1, 2, 3]
            })
    })

    it('should return valid object when links are undefined', () =>
        expect(toEntries({content: []})).toEqual({links: {}, entries: []}))

    it('should return valid object when input is undefined', () =>
        expect(toEntries(undefined)).toEqual({links: {}, entries: []}))
})
