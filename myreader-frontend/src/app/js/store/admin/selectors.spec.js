import {applicationInfoSelector, feedFetchFailuresSelector, filteredBySearchFeedsSelector} from '../../store'

describe('admin selectors', () => {

  let state

  beforeEach(() => {
    state = {
      admin: {
        applicationInfo: {a: 'b'},
        feeds: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}],
        fetchFailures: {failures: [{a: 'b', c: 'd'}]},
        fetchFailuresLoading: true
      }
    }
  })

  it('feedSelector should return application info', () => {
    expect(applicationInfoSelector(state)).toEqual({a: 'b'})
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
    expect(filteredBySearchFeedsSelector(undefined)(state).feeds.map(it => it.uuid)).toEqual(['1', '2'])
  })

  it('filteredBySearchFeedsSelector should return first feed matching query "title1"', () => {
    expect(filteredBySearchFeedsSelector('title1')(state).feeds.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchFeedsSelector should return second feed matching query "title2"', () => {
    expect(filteredBySearchFeedsSelector('title2')(state).feeds.map(it => it.uuid)).toEqual(['2'])
  })

  it('filteredBySearchFeedsSelector should return first feed matching query "TITLE1"', () => {
    expect(filteredBySearchFeedsSelector('TITLE1')(state).feeds.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchFeedsSelector should return two feeds matching query "titl"', () => {
    expect(filteredBySearchFeedsSelector('titl')(state).feeds.map(it => it.uuid)).toEqual(['1', '2'])
  })

  it('filteredBySearchFeedsSelector should return deep copy of feeds', () => {
    const actual = filteredBySearchFeedsSelector()(state).feeds
    state.admin.feeds[0].uuid = 'x'

    expect(actual.map(it => it.uuid)).toEqual(['1', '2'])
  })
})
