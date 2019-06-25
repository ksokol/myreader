import commonInitialState from './common'
import securityInitialState from './security'
import entryInitialState from './entry'
import subscriptionInitialState from './subscription'

export * from './common'
export * from './security'
export * from './entry'
export * from './subscription'

export function initialApplicationState() {
  return {
    common: commonInitialState(),
    security: securityInitialState(),
    entry: entryInitialState(),
    subscription: subscriptionInitialState()
  }
}
