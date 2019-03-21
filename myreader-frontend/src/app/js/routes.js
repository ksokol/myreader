export const LOGIN_URL = '!/login'
export const LOGOUT_URL = '!/logout'
export const ENTRIES_URL = '/entries/:feedTagEqual/:feedUuidEqual?q'
const BOOKMARK_URL = '/bookmark/'
export const BOOKMARK_TAGS_URL = '/bookmark/:entryTagEqual?q'
export const SUBSCRIPTIONS_URL = '/subscriptions?q'
export const SUBSCRIPTION_ADD_URL = '/subscriptions/add'
export const SUBSCRIPTION_URL = '/subscriptions/:uuid'
export const SETTINGS_URL = '/settings'
export const ADMIN_OVERVIEW_URL = '/overview'
export const ADMIN_FEEDS_URL = '/feed?q'
export const ADMIN_FEED_URL = '/feed/:uuid'

const paramRegexp = /:([a-z]+)/gi

const formatUrl = (template, params = {}) => {
  let path = template.split('?')[0]
  const matches = template.match(paramRegexp) || []

  for (let match of matches) {
    const value = params[match.slice(1)]
    path = path.replace(match, value !== null ? value : '')
  }

  return path
}

export const subscriptionsRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'subscriptions'],
  query: {q, ...rest},
  url: formatUrl(`!/app${SUBSCRIPTIONS_URL}`)
})

export const subscriptionRoute = ({uuid}) => ({
  route: ['app', 'subscription'],
  query: {uuid},
  url: `!/app${SUBSCRIPTION_URL}`
})

export const bookmarksRoute = () => ({
  route: ['app', 'bookmarks'],
  query: {entryTagEqual: null, q: undefined}, /* TODO Remove q and entryTagEqual parameter from UI Router */
  url: `!/app${BOOKMARK_URL}`
})

export const bookmarkTagsRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'bookmarks'],
  query: {q, ...rest},
  url: formatUrl(`!/app${BOOKMARK_TAGS_URL}`, rest)
})

export const settingsRoute = () => ({
  route: ['app', 'settings'],
  url: `!/app${SETTINGS_URL}`
})

export const subscriptionAddRoute = () => ({
  route: ['app', 'subscription-add'],
  url: `!/app${SUBSCRIPTION_ADD_URL}`
})

export const entriesRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'entries'],
  query: {q, ...rest},
  url: formatUrl(`!/app${ENTRIES_URL}`, rest)
})

export const loginRoute = () => ({
  route: ['login'],
  url: LOGIN_URL
})

export const logoutRoute = () => ({
  route: ['logout'],
  url: LOGOUT_URL
})

export const adminOverviewRoute = () => ({
  route: ['admin', 'overview'],
  url: `!/admin${ADMIN_OVERVIEW_URL}`
})

export const adminFeedRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['admin', 'feed'],
  query: {q, ...rest},
  url: `!/admin${ADMIN_FEEDS_URL}`
})

export const adminFeedDetailRoute = ({uuid}) => ({
  route: ['admin', 'feed-detail'],
  query: {uuid},
  url: `!/admin${ADMIN_FEED_URL}`
})
