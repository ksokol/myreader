import {createSelector} from 'reselect'
import {settingsShowUnseenEntriesSelector} from '../../store'
import {cloneObject} from '../shared/objects'

const routerQuerySelector = state => state.router.query
const subscriptionsSelector = state => state.subscription.subscriptions
const exclusionsSelector = state => state.subscription.exclusions

export const getSubscriptions = createSelector(
  subscriptionsSelector,
  subscriptions => {
    return {
      subscriptions: subscriptions.map(it => cloneObject(it))
    }
  }
)

export const filteredByUnseenSubscriptionsSelector = createSelector(
  subscriptionsSelector,
  settingsShowUnseenEntriesSelector,
  (subscriptions, showUnseenEntries) => {
    return {
      subscriptions: subscriptions
        .filter(it => showUnseenEntries ? it.unseen > 0 : true)
        .map(it => cloneObject(it))
    }
  }
)

export const subscriptionExclusionPatternsSelector = createSelector(
  routerQuerySelector,
  exclusionsSelector,
  (query, exclusions) => ({exclusions: (exclusions[query.uuid] || []).map(cloneObject)})
)

export const subscriptionByUuidSelector = uuid => {
  return createSelector(
    subscriptionsSelector,
    subscriptions => {
      return {
        subscription: cloneObject(subscriptions.find(it => it.uuid === uuid))
      }
    }
  )
}

export const subscriptionTagsSelector = createSelector(
  subscriptionsSelector,
  subscriptions => ({
    subscriptionTags: subscriptions
      .filter(subscription => subscription.feedTag.uuid)
      .map(subscription => subscription.feedTag)
      .reduce((acc, feedTag) => acc.some(it => it.uuid === feedTag.uuid) ? acc : [...acc, feedTag], [])
      .map(feedTag => cloneObject(feedTag))
      .sort((left, right) => left.name < right.name ? -1 : left.name === right.name ? 0 : 1)
  })
)

export const subscriptionEditFormSelector = createSelector(
  state => state.subscription.editForm,
  editForm => ({subscription: cloneObject(editForm)})
)
