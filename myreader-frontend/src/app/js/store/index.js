import commonInitialState from './common'
import securityInitialState from './security'

export * from './common'
export * from './security'

export function initialApplicationState() {
  return {
    common: commonInitialState(),
    security: securityInitialState()
  }
}
