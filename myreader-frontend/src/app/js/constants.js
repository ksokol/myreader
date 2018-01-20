export const ENVIRONMENT = process.env.NODE_ENV

/*
 * @deprecated
 */
export const CONTEXT = '/myreader'
export const API_2 = '/api/2'

export const LOGIN = 'check'
export const LOGOUT = 'logout'
export const FEEDS = CONTEXT + API_2 + '/feeds'
export const INFO = CONTEXT + '/info'
export const PROCESSING = CONTEXT + API_2 + '/processing'
export const SUBSCRIPTION_AVAILABLE_TAGS = CONTEXT + API_2 + '/subscriptions/availableTags'
export const ENTRY_AVAILABLE_TAGS = CONTEXT + API_2 + '/subscriptionEntries/availableTags'
export const SUBSCRIPTIONS = CONTEXT + API_2 + '/subscriptions'
export const SUBSCRIPTION_ENTRIES = CONTEXT + API_2 + '/subscriptionEntries'
export const EXCLUSION_TAGS = CONTEXT + API_2 + '/exclusions'

export const STORAGE_SETTINGS_KEY = 'myreader-settings'
export const STORAGE_SECURITY_KEY = 'myreader-security'

export const redirectToLoginPage = () => window.location.hash = '#/login'

export const supportedBreakpoints = () => {
    return {
        phone: '(max-width: 599px)',
        tablet: '(min-width: 600px) and (max-width: 1279px)',
        desktop: '(min-width: 1280px)'
    }
}
