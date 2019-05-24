export const ENVIRONMENT = process.env.NODE_ENV

export function isInProdMode(environment) {
  return 'production' === environment
}

export function isInDevMode(environment) {
  return 'development' === environment
}

export const APP_URL = '/app'
export const LOGIN_URL = `${APP_URL}/login`
export const LOGOUT_URL = `${APP_URL}/logout`
export const ENTRIES_URL = `${APP_URL}/entries`
export const BOOKMARK_URL = `${APP_URL}/bookmark`
export const SUBSCRIPTION_URL = `${APP_URL}/subscriptions/:uuid`
export const SUBSCRIPTIONS_URL = `${APP_URL}/subscriptions`
export const SUBSCRIPTION_ADD_URL = `${APP_URL}/addSubscription`
export const SETTINGS_URL = `${APP_URL}/settings`
export const ADMIN_OVERVIEW_URL = `${APP_URL}/overview`
export const ADMIN_FEEDS_URL = `${APP_URL}/feed`
export const ADMIN_FEED_URL = `${APP_URL}/feed/:uuid`

export const API_2 = 'api/2'
export const LOGIN = 'check'
export const LOGOUT = 'logout'
export const FEEDS = API_2 + '/feeds'
export const INFO = 'info'
export const PROCESSING = API_2 + '/processing'
export const ENTRY_AVAILABLE_TAGS = API_2 + '/subscriptionEntries/availableTags'
export const SUBSCRIPTIONS = API_2 + '/subscriptions'
export const SUBSCRIPTION_ENTRIES = API_2 + '/subscriptionEntries'
export const EXCLUSION_TAGS = API_2 + '/exclusions'
export const SUBSCRIPTION_TAGS = API_2 + '/subscriptionTags'

export const STORAGE_SETTINGS_KEY = 'myreader-settings'
export const STORAGE_SECURITY_KEY = 'myreader-security'

export const ROLE_ADMIN = 'ADMIN'
export const ROLE_USER = 'USER'

export const supportedBreakpoints = () => {
  return {
    phone: '(max-width: 599px)',
    tablet: '(min-width: 600px) and (max-width: 1279px)',
    desktop: '(min-width: 1280px)'
  }
}
