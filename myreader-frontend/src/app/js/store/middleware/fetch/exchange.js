import {fetchEnd, fetchStart, unauthorized} from 'store'

const READ_METHODS = ['GET', 'HEAD']
const METHODS = ['POST', 'PUT', 'DELETE', 'PATCH', ...READ_METHODS]

const MIME_APPLICATION_JSON = 'application/json'
const XML_HTTP_REQUEST = 'XMLHttpRequest'
const CONTENT_TYPE = 'content-Type'

const credentials = {
    credentials: 'same-origin'
}

function isUnauthorized(response) {
    return response.status === 401
}

function isError(response) {
    return !response.ok && !isUnauthorized(response)
}

function sanitizeHeaders(headers = {}) {
    return Object.entries(headers).reduce((acc, [key, value]) => {
        acc[key.toLowerCase()] = value
        return acc
    }, {})
}

function constructHeaders(headers) {
    return new Headers({
        'content-type': MIME_APPLICATION_JSON,
        'x-requested-with': XML_HTTP_REQUEST,
        ...sanitizeHeaders(headers)
    })
}

function isJSON(headers) {
    const contentType = headers.get(CONTENT_TYPE)
    return contentType ? contentType.indexOf(MIME_APPLICATION_JSON) === 0 : false
}

function transformBody(headers, body = '') {
    return isJSON(headers) ? JSON.stringify(body) : body
}

function constructBody(method, headers, body) {
    return READ_METHODS.includes(method) ? null : transformBody(headers, body)
}

function toArguments({url, method, headers, body}) {
    const _headers = constructHeaders(headers)
    const _body = constructBody(method, _headers, body)
    return new Request(url, {method, headers: _headers, body: _body, ...credentials})
}

function handleResponseBody(response, cb) {
    return isJSON(response.headers) ?
        response.json().then(json => cb(json)) :
        response.text().then(text => cb(text))
}

function handleResponse(response, dispatch, resolve, reject) {
    if (isUnauthorized(response)) {
        dispatch(fetchEnd())
        dispatch(unauthorized())
        handleResponseBody(response, reject)
    } else if(isError(response)) {
        dispatch(fetchEnd(response.statusText))
        handleResponseBody(response, reject)
    } else {
        dispatch(fetchEnd())
        handleResponseBody(response, resolve)
    }
}

function handleError (error, dispatch, reject) {
    dispatch(fetchEnd(error.toString()))
    reject(error)
}

export function supportedMethods() {
    return [...METHODS]
}

export function exchange(params) {
    return dispatch => {
        dispatch(fetchStart())

        return new Promise((resolve, reject) =>
            fetch(toArguments(params))
                .then(response => handleResponse(response, dispatch, resolve, reject))
                .catch(error => handleError(error, dispatch, reject))
        )
    }
}
