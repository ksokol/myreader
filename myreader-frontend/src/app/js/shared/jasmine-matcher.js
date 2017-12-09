import isMatch from 'lodash.ismatch'

export function toEqualActionType() {
    return {
        compare: (actual, expected) => {
            return {
                pass: actual.type === expected,
                message: `Expected action type ${actual.type} to equal ${expected}`
            }
        }
    }
}

export function toContainObject() {
    return {
        compare: (actual, expected) => {
            return {
                pass: isMatch(actual, expected),
                message: `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`
            }
        }
    }
}

export function toContainActionData() {

    const removeTypeProperty = object => {
        const action = {...object}
        delete action.type
        return action
    }

    return {
        compare: (actual, expected) => {
            const actualData = removeTypeProperty(actual)
            const expectedData = removeTypeProperty(expected)
            return {
                pass: isMatch(actualData, expectedData),
                message: `Expected action data ${JSON.stringify(actualData)} to contain ${JSON.stringify(expectedData)}`
            }
        }
    }
}
