import {toFeed, toFeedFetchFailure, toFeedFetchFailures, toFeeds} from './feed'

describe('src/app/js/store/admin/feed.spec.js', () => {

    describe('toFeed', () => {

        it('should return valid object when raw data is undefined', () => {
            expect(toFeed()).toEqual({links: {}})
        })

        it('should convert raw data', () => {
            expect(toFeed({
                uuid: 'expected uuid',
                a: 'b',
                c: 'd',
                links: [{rel: 'self', href: '/url?a=b'}, {rel: 'other', href: '/other'}]
            })).toEqual({
                uuid: 'expected uuid',
                a: 'b',
                c: 'd',
                links: {self: {path: '/url', query: {a: 'b'}}, other: {path: '/other', query: {}}}
            })
        })
    })

    describe('toFeeds', () => {

        it('should return valid object when raw data is undefined', () => {
            expect(toFeeds()).toEqual({feeds: []})
        })

        it('should convert raw data', () => {
            expect(toFeeds({
                content: [
                    {
                        uuid: 'uuid1',
                        a: 'b',
                        c: 'd',
                        links: [{rel: 'self', href: '/uuid1?a=b'}, {rel: 'other', href: '/other'}]
                    },
                    {
                        uuid: 'uuid2',
                        e: 'f',
                        links: [{rel: 'self', href: '/uuid2?a=b'}]
                    }
                ]
            })).toEqual({
                feeds: [
                    {
                        uuid: 'uuid1',
                        a: 'b',
                        c: 'd',
                        links: {self: {path: '/uuid1', query: {a: 'b'}}, other: {path: '/other', query: {}}}
                    },
                    {
                        uuid: 'uuid2',
                        e: 'f',
                        links: {self: {path: '/uuid2', query: {a: 'b'}}}
                    }
                ]
            })
        })
    })

    describe('toFeedFetchFailure', () => {

        it('should return valid object when raw data is undefined', () => {
            expect(toFeedFetchFailure()).toEqual({uuid: undefined, message: undefined, createdAt: undefined})
        })

        it('should convert raw data', () => {
            expect(toFeedFetchFailure({uuid: 'expected uuid', message: 'expected message', createdAt: 'expected createdAt'}))
                .toEqual({uuid: 'expected uuid', message: 'expected message', createdAt: 'expected createdAt'})
        })
    })

    describe('toFeedFetchFailures', () => {

        it('should return valid object when raw data is undefined', () => {
            expect(toFeedFetchFailures()).toEqual({failures: [], links: {}})
        })

        it('should convert raw data', () => {
            expect(toFeedFetchFailures(
                {
                    links: [{rel: 'self', href: 'self href?a=b'}, {rel: 'next', href: 'next href'}],
                    content: [
                        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
                        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
                    ]
                })
            ).toEqual(
                {
                    links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
                    failures: [
                        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
                        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
                    ]
                })
        })
    })
})
