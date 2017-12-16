import {toEntries, toEntry} from './entry'

describe('src/app/js/store/entry/entry.spec.js', () => {

    describe('toEntries', () => {

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
                content: [
                    {
                        uuid: 1,
                        key: 'value'
                    }, {
                        uuid: 2,
                        key: 'value'
                    }
                ]
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
                    entries: [
                        {
                            uuid: 1,
                            key: 'value'
                        }, {
                            uuid: 2,
                            key: 'value'
                        }
                    ]
                })
        })

        it('should return valid object when links are undefined', () =>
            expect(toEntries({content: []})).toEqual({links: {}, entries: []}))

        it('should return valid object when input is undefined', () =>
            expect(toEntries(undefined)).toEqual({links: {}, entries: []}))
    })

    describe('toEntry', () => {

        it('should convert raw data', () =>
            expect(toEntry({uuid: 1, key: 'value'})).toEqual({uuid: 1, key: 'value'}))

        it('should copy raw data', () => {
            const raw = {uuid: 1, key: 'value'}
            const actual = toEntry(raw)
            raw.key = 'other'
            expect(actual.key).toEqual('value')
        })

        it('should return valid object when input is undefined', () =>
            expect(toEntry()).toEqual({}))
    })
})
