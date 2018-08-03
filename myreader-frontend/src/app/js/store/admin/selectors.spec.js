import {applicationInfoSelector, feedFetchFailuresSelector, feedSelector, feedsSelector} from '../../store'

describe('src/app/js/store/admin/selectors.spec.js', () => {

  let state

  beforeEach(() => {
    state = {
      admin: {
        applicationInfo: {a: 'b'},
        feeds: [{uuid: 'uuid1'}, {uuid: 'uuid2'}],
        selectedFeed: {uuid: 'expected uuid', a: 'b', c: 'd'},
        fetchFailures: {failures: [{a: 'b', c: 'd'}]},
        fetchFailuresLoading: true
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

  it('feedsSelector should return deep copy of feeds', () => {
    const actual = feedsSelector(state)
    state.admin.feeds[0].uuid = 'x'

    expect(actual).toEqual({feeds: [{uuid: 'uuid1'}, {uuid: 'uuid2'}]})
  })
})
