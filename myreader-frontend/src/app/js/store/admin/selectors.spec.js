import {applicationInfoSelector, feedFetchFailuresSelector, feedSelector} from 'store'

describe('src/app/js/store/admin/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            admin: {
                applicationInfo: {a: 'b', fetchErrorRetainDays: 42},
                selectedFeed: {uuid: 'expected uuid', a: 'b', c: 'd'},
                fetchFailures: {failures: [{a: 'b', c: 'd'}], totalElements: 1}
            },
        }
    })

    it('feedSelector should return application info', () =>
        expect(applicationInfoSelector(state)).toEqual({a: 'b', fetchErrorRetainDays: 42}))

    it('feedSelector should return selected feed', () =>
        expect(feedSelector(state)).toEqual({uuid: 'expected uuid', a: 'b', c: 'd'}))

    it('feedSelector should return deep copy of selected feed', () => {
        const actual = feedSelector(state)
        state.admin.selectedFeed.a = 'x'

        expect(actual).toEqual({uuid: 'expected uuid', a: 'b', c: 'd'})
    })

    it('feedFetchFailuresSelector should return feed fetch failures', () =>
        expect(feedFetchFailuresSelector(state)).toEqual({failures: [{a: 'b', c: 'd'}], totalElements: 1, fetchErrorRetainDays: 42}))

    it('feedFetchFailuresSelector should return deep copy of feed fetch failures', () => {
        const actual = feedFetchFailuresSelector(state)
        state.admin.fetchFailures.failures[0].a = 'x'

        expect(actual.failures).toEqual([{a: 'b', c: 'd'}])
    })
})
