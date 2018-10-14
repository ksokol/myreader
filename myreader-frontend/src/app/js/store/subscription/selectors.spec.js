import {
  filteredByUnseenSubscriptionsSelector,
  getSubscriptions,
  subscriptionByUuidSelector,
  subscriptionEditFormSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'
import settingsInitialState from '../settings'
import routerInitialState from '../router'

describe('subscription selector', () => {

  let state

  const subscriptions = () => {
    return {
      subscriptions: [
        {uuid: '1', unseen: 1, feedTag: {id: undefined, name: undefined, color: undefined, links: []}},
        {uuid: '2', unseen: 0, feedTag: {id: undefined, name: undefined, color: undefined, links: []}}
      ]
    }
  }

  beforeEach(() => {
    state = {
      subscription: {...subscriptions(), exclusions: {}},
      settings: settingsInitialState(),
      router: routerInitialState()
    }
  })

  it('should return subscriptions', () => {
    expect(getSubscriptions(state)).toEqual(subscriptions())
  })

  it('selector getSubscriptions should return copy of subscriptions', () => {
    const actualSubscriptions = getSubscriptions(state).subscriptions
    actualSubscriptions[0].key = 'value'

    expect(state.subscription).toContainObject(subscriptions())
  })

  it('should return subscriptions with unseen greater than zero when showUnseenEntries is set to true', () => {
    expect(filteredByUnseenSubscriptionsSelector(state)).toEqual({
      subscriptions: [
        {uuid: '1', unseen: 1, feedTag: {uuid: undefined, name: undefined, color: undefined, links: []}}
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
    expect(subscriptionExclusionPatternsSelector(state)).toEqual({exclusions: []})
  })

  it('should return exclusions for given uuid', () => {
    state.router.query.uuid = '2'
    state.subscription.exclusions = {'1': [{a: 'b'}, {c: 'd'}], '2': [{e: 'f', g: 'h'}]}

    expect(subscriptionExclusionPatternsSelector(state)).toEqual({exclusions: [{e: 'f', g: 'h'}]})
  })

  it('should return copy of exclusions', () => {
    state.router.query.uuid = '1'
    state.subscription.exclusions = {'1': [{a: 'b'}]}
    const selection = subscriptionExclusionPatternsSelector(state)
    state.subscription.exclusions['1'][0].a = 'x'

    expect(selection).toEqual({exclusions: [{a: 'b'}]})
  })

  it('should return subscription for given uuid', () => {
    state.subscription.subscriptions = [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]

    expect(subscriptionByUuidSelector('2')(state)).toEqual({subscription: {uuid: '2', c: 'd'}})
  })

  it('should return copy of subscription', () => {
    state.subscription.subscriptions = [{uuid: '1', a: 'b'}, {uuid: '2', c: 'd'}]
    const selection = subscriptionByUuidSelector('1')(state)
    state.subscription.subscriptions[0].a = 'x'

    expect(selection).toEqual({subscription: {uuid: '1', a: 'b'}})
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

  it('should return subscription edit form data', () => {
    state.subscription.editForm = {a: 'b', c: 'd'}

    expect(subscriptionEditFormSelector(state)).toEqual({subscription: {a: 'b', c: 'd'}})
  })

  it('should return copy of subscription edit form data', () => {
    state.subscription.editForm = {a: 'b', c: 'd'}
    const selection = subscriptionEditFormSelector(state)
    state.subscription.editForm.a = 'x'

    expect(selection).toEqual({subscription: {a: 'b', c: 'd'}})
  })
})
