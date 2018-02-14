import {toFeedFetchFailure, toFeedFetchFailures} from './feed'

describe('src/app/js/store/admin/feed.spec.js', () => {

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
            expect(toFeedFetchFailures()).toEqual({failures: [], links: {}, totalElements: 0})
        })

        it('should convert raw data', () => {
            expect(toFeedFetchFailures(
                {
                    links: [{rel: 'self', href: 'self href?a=b'}, {rel: 'next', href: 'next href'}],
                    content: [
                        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
                        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
                    ],
                    page: {
                        totalElements: 2
                    }
                })
            ).toEqual(
                {
                    links: {next: {path: 'next href', query: {}}, self: {path: 'self href', query: {a: 'b'}}},
                    failures: [
                        {uuid: '1', message: 'message 1', createdAt: 'createdAt 1'},
                        {uuid: '2', message: 'message 2', createdAt: 'createdAt 2'}
                    ],
                    totalElements: 2
                })
        })
    })
})
