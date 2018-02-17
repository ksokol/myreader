import {isDate, isObject} from 'shared/utils'

export function cloneObject(object) {
    if (!isObject(object)) {
        return object
    }
    if (isDate(object)) {
        return new Date(object)
    }
    return object ? Object.entries(object).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            acc[key] = value.map(cloneObject)
        } else if (isObject(value)) {
            acc[key] = cloneObject(value)
        } else {
            acc[key] = value
        }
        return acc
    }, {}) : object
}
