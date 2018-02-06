import {SUBSCRIPTION_ENTRIES} from 'constants'
import {fetchEntries, fetchEntryTags} from 'store'

export const routes = {
    app: {
        children: {
            bookmarks: {
                query: {seenEqual: '*', entryTagEqual: ''},
                before: fetchEntryTags,
                resolve: query => fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
            }
        }
    }
}

export function findRouteConfiguration(route = []) {
    const routeConfiguration = routes[route[0]]
    return routeConfiguration ? {route, ...routeConfiguration.children[route[1]]} : {route}
}
