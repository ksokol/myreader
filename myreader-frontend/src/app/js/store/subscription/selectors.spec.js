import {
  filteredBySearchSubscriptionsSelector,
  filteredByUnseenSubscriptionsSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'
import settingsInitialState from '../settings'

describe('subscription selector', () => {

  let state

  const subscriptions = () => {
    return {
      subscriptions: [
        {uuid: '1', title: 'title1', unseen: 1, feedTag: {id: undefined, name: undefined, color: undefined, links: []}},
        {uuid: '2', title: 'title2', unseen: 0, feedTag: {id: undefined, name: undefined, color: undefined, links: []}}
      ]
    }
  }

  beforeEach(() => {
    state = {
      subscription: {...subscriptions(), exclusions: {}},
      settings: settingsInitialState()
    }
  })

  it('filteredBySearchSubscriptionsSelector should return two subscriptions when query is undefined', () => {
    expect(filteredBySearchSubscriptionsSelector()(state)).toEqual(subscriptions())
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "title1"', () => {
    expect(filteredBySearchSubscriptionsSelector('title1')(state).subscriptions.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchSubscriptionsSelector should return second subscription matching query "title2"', () => {
    expect(filteredBySearchSubscriptionsSelector('title2')(state).subscriptions.map(it => it.uuid)).toEqual(['2'])
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "TITLE1"', () => {
    expect(filteredBySearchSubscriptionsSelector('TITLE1')(state).subscriptions.map(it => it.uuid)).toEqual(['1'])
  })

  it('filteredBySearchSubscriptionsSelector should return two subscriptions matching query "titl"', () => {
    expect(filteredBySearchSubscriptionsSelector('titl')(state)).toEqual(subscriptions())
  })

  it('filteredBySearchSubscriptionsSelector should return no subscriptions for query "other"', () => {
    expect(filteredBySearchSubscriptionsSelector('other')(state).subscriptions).toEqual([])
  })

  it('filteredBySearchSubscriptionsSelector should return copy of subscriptions', () => {
    const actualSubscriptions = filteredBySearchSubscriptionsSelector()(state).subscriptions
    actualSubscriptions[0].title = 'x'

    expect(state.subscription).toContainObject(subscriptions())
  })

  it('should return subscriptions with unseen greater than zero when showUnseenEntries is set to true', () => {
    expect(filteredByUnseenSubscriptionsSelector(state)).toEqual({
      subscriptions: [
        {uuid: '1', title: 'title1', unseen: 1, feedTag: {uuid: undefined, name: undefined, color: undefined, links: []}}
      ]
    })
  })

  it('should return all subscriptions when showUnseenEntries is set to false', () => {
    state.settings.showUnseenEntries = false
    expect(filteredByUnseenSubscriptionsSelector(state)).toEqual(subscriptions())
  })

  it('selector filteredByUnseenSubscriptionsSelector should return copy of subscriptions', () => {
    const actualSubscriptions = filteredByUnseenSubscriptionsSelector(state).subscriptions
    actualSubscriptions[0].key = 'value'

    expect(state.subscription).toContainObject(subscriptions())
  })

  it('should return empty array when exclusions for uuid not present', () => {
    expect(subscriptionExclusionPatternsSelector()(state)).toEqual({exclusions: []})
  })

  it('should return exclusions for given uuid', () => {
    state.subscription.exclusions = {'1': [{a: 'b'}, {c: 'd'}], '2': [{e: 'f', g: 'h'}]}

    expect(subscriptionExclusionPatternsSelector('2')(state)).toEqual({exclusions: [{e: 'f', g: 'h'}]})
  })

  it('should return copy of exclusions', () => {
    state.subscription.exclusions = {'1': [{a: 'b'}]}
    const selection = subscriptionExclusionPatternsSelector('1')(state)
    state.subscription.exclusions['1'][0].a = 'x'

    expect(selection).toEqual({exclusions: [{a: 'b'}]})
  })

  it('should return subscription tags', () => {
    state.subscription.subscriptions = [
      {feedTag: {uuid: 1, name: 'b', color: undefined, links: []}},
      {feedTag: {uuid: 2, name: 'c', color: undefined, links: []}},
      {feedTag: {uuid: 1, name: 'b', color: undefined, links: []}},
      {feedTag: {uuid: 3, name: 'a', color: undefined, links: []}}
    ]

    expect(subscriptionTagsSelector(state)).toEqual({
      subscriptionTags: [
        {uuid: 3, name: 'a', color: undefined, links: []},
        {uuid: 1, name: 'b', color: undefined, links: []},
        {uuid: 2, name: 'c', color: undefined, links: []}]
    })
  })

  it('should return copy of subscription tags', () => {
    state.subscription.subscriptions = [
      {feedTag: {uuid: 1, name: 'b', color: undefined, links: []}},
      {feedTag: {uuid: 1, name: 'b', color: undefined, links: []}},
      {feedTag: {uuid: 3, name: 'a', color: undefined, links: []}}
    ]
    const selection = subscriptionTagsSelector(state)
    state.subscription.subscriptions[0].name = 'x'

    expect(selection).toEqual({
      subscriptionTags: [
        {uuid: 3, name: 'a', color: undefined, links: []},
        {uuid: 1, name: 'b', color: undefined, links: []}
      ]
    })
  })
})
