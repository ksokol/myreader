function appendToObject(object, pair) {
    const keyValue = pair.split('=')
    if (keyValue.length === 2) {
        object[keyValue[0]] = keyValue[1]
    }
    return object;
}

function toQuery(queryString = '') {
    return queryString.split('&').reduce((acc, pair) => appendToObject(acc, pair), {});
}

function toLink(url) {
    const [path, queryString] = url.split('?')
    const query = toQuery(queryString)
    return {path, query}
}

export function extractLinks(links = []) {
    return links.reduce((acc, link) => {
        if (typeof link.href === 'string') {
            acc[link.rel] = toLink(link.href)
        }
        return acc
    }, {})
}

function toFilteredKeys(ignore, query = {}) {
    return Object.keys(query).filter(it => !ignore.includes(it))
}

export function equalLinks(left = {}, right = {}, ignore = []) {
    if (left.path !== right.path) {
        return false;
    }

    const leftQueryKeys = toFilteredKeys(ignore, left.query)
    const rightQueryKeys = toFilteredKeys(ignore, right.query)

    if (leftQueryKeys.length !== rightQueryKeys.length) {
        return false;
    }

    if (leftQueryKeys.some(it => !rightQueryKeys.includes(it))) {
        return false
    }

    return !leftQueryKeys.some(key => left.query[key] !== right.query[key])
}

function toQueryParams(query = {}) {
    const queryParams = Object
        .entries(query)
        .filter(([key, value]) => value !== undefined && value !== null)
        .reduce((acc, [key, value]) => `${key}=${value}&${acc}`, '')
    return queryParams ? queryParams.slice(0, -1) : queryParams
}

export function toUrlString(link) {
    const url = link.path || ''
    const queryParams = toQueryParams(link.query)
    return queryParams ? `${url}?${queryParams}` : url
}
