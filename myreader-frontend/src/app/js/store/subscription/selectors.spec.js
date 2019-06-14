import {
  filteredBySearchSubscriptionsSelector,
  filteredByUnseenSubscriptionsSelector
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
})
