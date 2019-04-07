export const ENVIRONMENT = process.env.NODE_ENV

export function isInProdMode(environment) {
  return 'production' === environment
}

export function isInDevMode(environment) {
  return 'development' === environment
}

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
