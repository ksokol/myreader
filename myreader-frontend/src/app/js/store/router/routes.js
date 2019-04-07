import {FEEDS, SUBSCRIPTION_ENTRIES} from '../../constants'
import {
  clearFeedEditForm,
  clearSubscriptionEditForm,
  entryClear,
  feedFetchFailuresClear,
  fetchApplicationInfo,
  fetchEntries,
  fetchEntryTags,
  loadFeedIntoEditForm,
  fetchFeedFetchFailures,
  fetchFeeds,
  fetchSubscriptionExclusionPatterns,
  fetchSubscriptions,
  loadSubscriptionIntoEditForm,
  logout
} from '../../store'

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
          ({query}) => loadSubscriptionIntoEditForm(query.uuid),
          ({query}) => fetchSubscriptionExclusionPatterns(query.uuid)
        ]
      },
      bookmarks: {
        query: {seenEqual: '*', entryTagEqual: ''},
        before: fetchEntryTags,
        resolve: ({query}) => fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
      },
      'subscription-add': {
        before: clearSubscriptionEditForm
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
        before: [
          clearFeedEditForm,
          feedFetchFailuresClear
        ],
        resolve: [
          ({query}) => loadFeedIntoEditForm(query.uuid),
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
