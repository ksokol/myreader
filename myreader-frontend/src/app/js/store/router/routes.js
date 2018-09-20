import {FEEDS, SUBSCRIPTION_ENTRIES} from '../../constants'
import {
  clearSubscriptionEditForm,
  entryClear,
  feedClear,
  feedFetchFailuresClear,
  fetchApplicationInfo,
  fetchEntries,
  fetchEntryTags,
  fetchFeed,
  fetchFeedFetchFailures,
  fetchFeeds,
  fetchSubscriptionExclusionPatterns,
  fetchSubscriptions,
  fetchSubscriptionTags,
  loadSubscriptionIntoEditForm,
  subscriptionTagsLoaded
} from '../../store'
import {logout} from '../security'

export const routeConfiguration = {
  logout: {
    resolve: logout
  },
  app: {
    before: fetchSubscriptions,
    children: {
      entries: {
        resolve: [
          entryClear,
          ({query}) => fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
        ]
      },
      subscription: {
        before: clearSubscriptionEditForm,
        resolve: [
          ({query, getState}) => subscriptionTagsLoaded(getState()).loaded ? undefined : fetchSubscriptionTags(),
          ({query}) => loadSubscriptionIntoEditForm(query.uuid),
          ({query}) => fetchSubscriptionExclusionPatterns(query.uuid)
        ]
      },
      bookmarks: {
        query: {seenEqual: '*', entryTagEqual: ''},
        before: fetchEntryTags,
        resolve: ({query}) => fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
      }
    }
  },
  admin: {
    before: fetchApplicationInfo,
    children: {
      feed: {
        resolve: fetchFeeds
      },
      'feed-detail': {
        before: [feedClear, feedFetchFailuresClear],
        resolve: [
          ({query}) => fetchFeed(query.uuid),
          ({query}) => fetchFeedFetchFailures({path: `${FEEDS}/${query.uuid}/fetchError`})
        ]
      }
    }
  }
}

export function findRouteConfiguration(route = [], routes = routeConfiguration) {
  const configuration = routes[route[0]]

  if (!configuration) {
    return {route}
  }

  const {children = {}, ...rest} = configuration
  return {route, ...children[route[1]], parent: {route: [route[0]], ...rest}}
}
