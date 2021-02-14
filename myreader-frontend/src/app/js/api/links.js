function appendToObject(object, pair) {
  const keyValue = pair.split('=')
  if (keyValue.length === 2) {
    object[keyValue[0]] = keyValue[1]
  }
  return object
}

function toQuery(queryString = '') {
  return queryString.split('&').reduce((acc, pair) => appendToObject(acc, pair), {})
}

export function toLink(url) {
  const [path, queryString] = url.split('?')
  const query = toQuery(queryString)
  return {path, query}
}

function toQueryParams(query = {}) {
  const queryParams = Object
    .entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => `${key}=${value}&${acc}`, '')
  return queryParams ? queryParams.slice(0, -1) : queryParams
}

export function toUrlString(link) {
  const url = link.path || ''
  const queryParams = toQueryParams(link.query)
  return queryParams ? `${url}?${queryParams}` : url
}
