import adminInitialState from './admin'
import commonInitialState from './common'
import securityInitialState from './security'
import entryInitialState from './entry'
import settingsInitialState from './settings'
import subscriptionInitialState from './subscription'
import routerInitialState from './router'

export * from './admin'
export * from './common'
export * from './security'
export * from './settings'
export * from './entry'
export * from './subscription'
export * from './router'

export function initialApplicationState() {
    return {
        admin: adminInitialState(),
        settings: settingsInitialState(),
        common: commonInitialState(),
        security: securityInitialState(),
        entry: entryInitialState(),
        subscription: subscriptionInitialState(),
        router: routerInitialState()
    }
}
