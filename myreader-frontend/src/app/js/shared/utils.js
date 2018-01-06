function isObject(value) {
    return value !== null && typeof value === 'object'
}

function isFunction(value) {
    return typeof value === 'function'
}

export function isPromiseLike(value) {
    return !!(isObject(value) && isFunction(value.then) && isFunction(value.catch))
}

export function isBoolean(value) {
    return typeof value === 'boolean'
}

