import {feedsSelector} from '../../store'

describe('admin selectors', () => {

  let state

  beforeEach(() => {
    state = {
      admin: {
        feeds: [{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}]
      }
    }
  })

  it(' should return feeds', () => {
    expect(feedsSelector(state).feeds).toEqual([{uuid: '1', title: 'title1'}, {uuid: '2', title: 'title2'}])
  })

  it('should return deep copy of feeds', () => {
    const actual = feedsSelector(state).feeds
    state.admin.feeds[0].uuid = 'x'

    expect(actual.map(it => it.uuid)).toEqual(['1', '2'])
  })
})
