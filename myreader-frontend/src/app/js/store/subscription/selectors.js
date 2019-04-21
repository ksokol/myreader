import {settingsShowUnseenEntriesSelector} from '../../store'
import {cloneObject} from '../shared/objects'

export const filteredBySearchSubscriptionsSelector = (q = '') => {
  return state => {
    const subscriptions = state.subscription.subscriptions
    return {
      subscriptions: q
        ? subscriptions
          .filter(({title}) => title.toLowerCase().indexOf(q.toLowerCase()) !== -1)
          .map(cloneObject)
        : subscriptions.map(cloneObject)
    }
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

export const subscriptionExclusionPatternsSelector = (uuid = '') => {
  return state => ({
    exclusions: (state.subscription.exclusions[uuid] || []).map(cloneObject)
  })
}

export const subscriptionTagsSelector = state => ({
  subscriptionTags: state.subscription.subscriptions
    .filter(subscription => subscription.feedTag.uuid)
    .map(subscription => subscription.feedTag)
    .reduce((acc, feedTag) => acc.some(it => it.uuid === feedTag.uuid) ? acc : [...acc, feedTag], [])
    .map(feedTag => cloneObject(feedTag))
    .sort((left, right) => left.name < right.name ? -1 : left.name === right.name ? 0 : 1)
})

export const subscriptionEditFormSelector = state => ({
  ...cloneObject(state.subscription.editForm)
})

