const storage = localStorage

export function readFromStorage(key) {
  let source = {}
  try {
    source = JSON.parse(storage.getItem(key)) || {}
  } catch {
    // ignore
  }
  return source
}

export function writeToStorage(key, object) {
  storage.setItem(key, JSON.stringify(object))
}
