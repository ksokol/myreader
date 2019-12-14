import isMatch from 'lodash.ismatch'

function removeTypeProperty(object) {
  const action = {...object}
  delete action.type
  return action
}

export function toEqualActionType(actual, expected) {
  return {
    pass: actual.type === expected,
    message: () => `Expected action type ${actual.type} to equal ${expected}`
  }
}

export function toContainObject(actual, expected) {
  return {
    pass: isMatch(actual, expected),
    message: () => `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`
  }
}

export function toContainActionData(actual, expected) {
  const actualData = removeTypeProperty(actual)
  const expectedData = removeTypeProperty(expected)

  return {
    pass: isMatch(actualData, expectedData),
    message: () => `Expected action data ${JSON.stringify(actualData)} to contain ${JSON.stringify(expectedData)}`
  }
}
