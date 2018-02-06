export function cloneObject(object) {
    return object ? Object.entries(object).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            acc[key] = [...value]
        } else if (typeof value === 'object') {
            acc[key] = cloneObject(value)
        } else {
            acc[key] = value
        }
        return acc
    }, {}) : object
}
