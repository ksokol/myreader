import {SUBSCRIPTION_ENTRIES} from 'constants'
import {fetchEntries, fetchEntryTags, fetchApplicationInfo} from 'store'

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
        before: fetchApplicationInfo
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
