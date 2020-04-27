import isMatch from 'lodash.ismatch'

export function toContainObject(actual, expected) {
  return {
    pass: isMatch(actual, expected),
    message: () => `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`
  }
}
