import commonInitialState from './common'

export * from './common'

export function initialApplicationState() {
  return {
    common: commonInitialState(),
  }
}
