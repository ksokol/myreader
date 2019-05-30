const READ_METHODS = ['GET', 'HEAD']
const MIME_APPLICATION_JSON = 'application/json'
const XML_HTTP_REQUEST = 'XMLHttpRequest'
const CONTENT_TYPE = 'content-type'
const credentials = {credentials: 'same-origin'}

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

function toRequest({url, method, headers, body}) {
  const _headers = constructHeaders(headers)
  const _body = constructBody(method, _headers, body)
  return new Request(url, {method, headers: _headers, body: _body, ...credentials})
}

function collectHeaders(response) {
  const headers = {}
  for (const [key, value] of response.headers.entries()) {
    headers[key] = value
  }
  return headers
}

function handleResponse(response) {
  return isJSON(response.headers) ?
    response.json().then(json => ({
      ok: response.ok,
      status: response.status,
      data: json,
      headers: collectHeaders(response)
    })) :
    response.text().then(text => ({
      ok: response.ok,
      status: response.status,
      data: text,
      headers: collectHeaders(response)
    }))
}

function handleError(error) {
  return {ok: false, status: -1, data: error.toString(), headers: {}}
}

export function exchange(params) {
  return fetch(toRequest(params))
    .then(response => handleResponse(response))
    .catch(error => handleError(error))
}
