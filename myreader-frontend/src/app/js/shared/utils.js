function isFunction(value) {
    return typeof value === 'function'
}

export function isString(value) {
    return value !== null && typeof value === 'string'
}

export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export function isPromiseLike(value) {
    return !!(isObject(value) && isFunction(value.then) && isFunction(value.catch))
}

export function isBoolean(value) {
    return typeof value === 'boolean'
}

export function isDate(value) {
    return value instanceof Date
}

export function toArray(value) {
    return value ? Array.isArray(value) ? value : [value] : []
}

export function arrayIncludes(left, right) {
    return Array.isArray(left) && Array.isArray(right) &&
        left.every((leftValue, leftIndex) => leftValue === right[leftIndex])
}
