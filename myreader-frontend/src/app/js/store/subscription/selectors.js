import {settingsShowUnseenEntriesSelector} from '../../store'
import {cloneObject} from '../shared/objects'

export const subscriptionsSelector = state => {
  return {
    subscriptions: state.subscription.subscriptions.map(cloneObject)
  }
}

export const filteredByUnseenSubscriptionsSelector = state => {
  const subscriptions = state.subscription.subscriptions
  const showUnseenEntries = settingsShowUnseenEntriesSelector(state)
  return {
    subscriptions: subscriptions
      .filter(it => showUnseenEntries ? it.unseen > 0 : true)
      .map(it => cloneObject(it))
  }
}
