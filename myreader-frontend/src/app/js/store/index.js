export * from './admin'
export * from './common'
export * from './security'
export * from './settings'
export * from './entry'
export * from './subscription'

import commonInitialState from './common'
import entryInitialState from './entry'
import settingsInitialState from './settings'
import subscriptionInitialState from './subscription'

export function initialApplicationState() {
    return {
        settings: settingsInitialState(),
        common: commonInitialState(),
        entry: entryInitialState(),
        subscription: subscriptionInitialState()
    }
}
