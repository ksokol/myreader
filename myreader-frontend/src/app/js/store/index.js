import commonInitialState from './common'
import securityInitialState from './security'
import subscriptionInitialState from './subscription'

export * from './common'
export * from './security'
export * from './entry'
export * from './subscription'

export function initialApplicationState() {
  return {
    common: commonInitialState(),
    security: securityInitialState(),
    subscription: subscriptionInitialState()
  }
}
