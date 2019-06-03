import commonInitialState from './common'
import securityInitialState from './security'
import entryInitialState from './entry'
import settingsInitialState from './settings'
import subscriptionInitialState from './subscription'

export * from './admin'
export * from './common'
export * from './security'
export * from './settings'
export * from './entry'
export * from './subscription'

export function initialApplicationState() {
  return {
    settings: settingsInitialState(),
    common: commonInitialState(),
    security: securityInitialState(),
    entry: entryInitialState(),
    subscription: subscriptionInitialState()
  }
}
