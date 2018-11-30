import {
  applicationInfoSelector,
  feedFetchFailuresSelector,
  feedSelector,
  filteredBySearchFeedsSelector
} from '../../store'

describe('src/app/js/store/admin/selectors.spec.js', () => {

  let state

  beforeEach(() => {
    state = {
      admin: {
        applicationInfo: {a: 'b'},
        feeds: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}],
        selectedFeed: {uuid: 'expected uuid', a: 'b', c: 'd'},
        fetchFailures: {failures: [{a: 'b', c: 'd'}]},
        fetchFailuresLoading: true
      },
      router: {
        query: {}
      }
    }
  })

  it('feedSelector should return application info', () => {
    expect(applicationInfoSelector(state)).toEqual({a: 'b'})
  })

  it('feedSelector should return selected feed', () => {
    expect(feedSelector(state)).toEqual({uuid: 'expected uuid', a: 'b', c: 'd'})
  })

  it('feedSelector should return deep copy of selected feed', () => {
    const actual = feedSelector(state)
    state.admin.selectedFeed.a = 'x'

    expect(actual).toEqual({uuid: 'expected uuid', a: 'b', c: 'd'})
  })

  it('feedFetchFailuresSelector should return feed fetch failures', () =>
    expect(feedFetchFailuresSelector(state)).toContainObject({failures: [{a: 'b', c: 'd'}]}))

  it('feedFetchFailuresSelector should return deep copy of feed fetch failures', () => {
    const actual = feedFetchFailuresSelector(state)
    state.admin.fetchFailures.failures[0].a = 'x'

    expect(actual.failures).toEqual([{a: 'b', c: 'd'}])
  })

  it('should return fetchFailuresLoading flag', () => {
    expect(feedFetchFailuresSelector(state).fetchFailuresLoading).toEqual(true)
  })

  it(' should return two feeds when query is undefined', () => {
    expect(filteredBySearchFeedsSelector(state).feeds.map(it => it.uuid)).toEqual(['1', '2'])
  })

  it('filteredBySearchFeedsSelector should return first feed matching query "title1"', () => {
    state.router.query.q = 'title1'

    expect(filteredBySearchFeedsSelector(state).feeds.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchFeedsSelector should return second feed matching query "title2"', () => {
    state.router.query.q = 'title2'

    expect(filteredBySearchFeedsSelector(state).feeds.map(it => it.uuid)).toEqual(['2'])
  })

  it('filteredBySearchFeedsSelector should return first feed matching query "TITLE1"', () => {
    state.router.query.q = 'TITLE1'

    expect(filteredBySearchFeedsSelector(state).feeds.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchFeedsSelector should return two feeds matching query "titl"', () => {
    state.router.query.q = 'titl'

    expect(filteredBySearchFeedsSelector(state).feeds.map(it => it.uuid)).toEqual(['1', '2'])
  })

  it('filteredBySearchFeedsSelector should return deep copy of feeds', () => {
    const actual = filteredBySearchFeedsSelector(state).feeds
    state.admin.feeds[0].uuid = 'x'

    expect(actual.map(it => it.uuid)).toEqual(['1', '2'])
  })
})
