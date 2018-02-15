import {SUBSCRIPTION_ENTRIES} from 'constants'
import {feedFetchFailuresClear, fetchApplicationInfo, fetchEntries, fetchEntryTags, fetchFeedFetchFailures} from 'store'
import {FEEDS} from 'constants'

export const routeConfiguration = {
    app: {
        children: {
            bookmarks: {
                query: {seenEqual: '*', entryTagEqual: ''},
                before: fetchEntryTags,
                resolve: query => fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
            }
        }
    },
    admin: {
        before: fetchApplicationInfo,
        children: {
            'feed-detail': {
                before: feedFetchFailuresClear,
                resolve: query => fetchFeedFetchFailures({path: `${FEEDS}/${query.uuid}/fetchError`})
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
