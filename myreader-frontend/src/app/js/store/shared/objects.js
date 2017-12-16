export function cloneObject(object) {
    return object ? Object.entries(object).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'object' ? cloneObject(value) : value
        return acc
    }, {}) : object
}
