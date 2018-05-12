const storage = localStorage

export function readFromStorage(key) {
    let source = {}
    try {
        source = JSON.parse(storage.getItem(key)) || {}
    } catch (e) {
        return source
    }
    return source
}

export function writeToStorage(key, object) {
    storage.setItem(key, toJson(object))
}

function toJson(object) {
    return JSON.stringify(object)
}
