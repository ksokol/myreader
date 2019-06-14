import {filteredByUnseenSubscriptionsSelector} from '../../store'
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
