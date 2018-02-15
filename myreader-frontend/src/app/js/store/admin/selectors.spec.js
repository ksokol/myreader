import {applicationInfoSelector, feedFetchFailuresSelector} from 'store'

describe('src/app/js/store/admin/selectors.spec.js', () => {

    let state

    beforeEach(() => {
        state = {
            admin: {
                applicationInfo: {a: 'b', fetchErrorRetainDays: 42},
                fetchFailures: {failures: [{a: 'b', c: 'd'}], totalElements: 1}
            },
        }
    })

    it('applicationInfoSelector should return application info', () =>
        expect(applicationInfoSelector(state)).toEqual({a: 'b', fetchErrorRetainDays: 42}))


    it('feedFetchFailuresSelector should return feed fetch failures', () =>
        expect(feedFetchFailuresSelector(state)).toEqual({failures: [{a: 'b', c: 'd'}], totalElements: 1, fetchErrorRetainDays: 42}))

    it('feedFetchFailuresSelector should return deep copy of feed fetch failures', () => {
        const actual = feedFetchFailuresSelector(state)
        state.admin.fetchFailures.failures[0].a = 'x'

        expect(actual.failures).toEqual([{a: 'b', c: 'd'}])
    })
})
