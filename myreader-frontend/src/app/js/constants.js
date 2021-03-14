export const APP_URL = '/app'
export const LOGIN_PAGE_PATH = `${APP_URL}/login`
export const LOGOUT_PAGE_PATH = `${APP_URL}/logout`
export const ENTRIES_URL = `${APP_URL}/entries`
export const BOOKMARK_PAGE_PATH = `${APP_URL}/bookmark`
export const SUBSCRIPTION_PAGE_PATH = `${APP_URL}/subscriptions/:uuid`
export const SUBSCRIPTIONS_URL = `${APP_URL}/subscriptions`
export const SUBSCRIPTION_ADD_URL = `${APP_URL}/addSubscription`
export const SETTINGS_URL = `${APP_URL}/settings`

export const API_2 = 'api/2'
export const SUBSCRIPTIONS = `${API_2}/subscriptions`
export const SUBSCRIPTION_ENTRIES = `${API_2}/subscriptionEntries`

export const STORAGE_SETTINGS_KEY = 'myreader-settings'
export const STORAGE_SECURITY_KEY = 'myreader-security'

export const supportedBreakpoints = () => {
  return {
    phone: '(max-width: 599px)',
    tablet: '(min-width: 600px) and (max-width: 1279px)',
    desktop: '(min-width: 1280px)'
  }
}
