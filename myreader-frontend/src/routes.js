export const subscriptionsRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'subscriptions'],
  query: {q, ...rest}
})

export const subscriptionRoute = ({uuid}) => ({
  route: ['app', 'subscription'],
  query: {uuid}
})

export const bookmarksRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'bookmarks'],
  query: {q, ...rest}
})

export const settingsRoute = () => ({
  route: ['app', 'settings']
})

export const subscriptionAddRoute = () => ({
  route: ['app', 'subscription-add']
})

export const entriesRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['app', 'entries'],
  query: {q, ...rest}
})

export const loginRoute = () => ({
  route: ['login']
})

export const logoutRoute = () => ({
  route: ['logout']
})

export const adminOverviewRoute = () => ({
  route: ['admin', 'overview']
})

export const adminFeedRoute = ({q = undefined /* TODO Remove q parameter from UI Router */, ...rest} = {}) => ({
  route: ['admin', 'feed'],
  query: {q, ...rest}
})

export const adminFeedDetailRoute = ({uuid}) => ({
  route: ['admin', 'feed-detail'],
  query: {uuid}
})
