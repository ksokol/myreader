import isEqual from 'lodash.isequal'

function parseUrl(urlString) {
  const url = new URL(`http://localhost/${urlString}`)
  const path = url.pathname
  let search = new URLSearchParams(url.search)
  search.sort()
  search = search.toString()

  return {
    path,
    search,
    equals: other => path === other.path && search === other.search,
    toString: () => search ? `${url.pathname}?${search}` : url.pathname,
  }
}

function toMatchRequest(actual, expected) {
  let pass = true
  const expectedValues = {}
  const actualValues = {}

  if ('method' in expected) {
    if (expected.method !== actual.method) {
      actualValues.method = actual.method
      expectedValues.method = expected.method
      pass = false
    }
  }

  if ('url' in expected) {
    const expectedUrl = parseUrl(expected.url)
    const actualUrl = parseUrl(actual.url)

    if (!expectedUrl.equals(actualUrl)) {
      actualValues.url = actualUrl.toString()
      expectedValues.url = expectedUrl.toString()
      pass = false
    }
  }

  if ('body' in expected) {
    const expectedBody = expected.body
    const actualBody = actual.body instanceof URLSearchParams
      ? actual.body.toString()
      : JSON.parse(actual && actual.body || '')

    if (!isEqual(actualBody, expectedBody)) {
      actualValues.body = actualBody
      expectedValues.body = expectedBody
      pass = false
    }
  }

  if ('headers' in expected) {
    const expectedHeaders = expected.headers

    const actualHeaders = actual.headers
    if (!isEqual(actual.headers, expectedHeaders)) {
      actualValues.headers = actualHeaders
      expectedValues.headers = expectedHeaders
      pass = false
    }

  }

  return {
    pass,
    message: () => {
      const to = this.isNot ? 'not to' : 'to'
      const matcher = `${this.isNot ? '.not' : ''}.toMatchRequest`
      return [
        this.utils.matcherHint(matcher, 'actual', 'expected'),
        `Expected the request ${to} match`,
        this.utils.diff(expectedValues, actualValues),
      ].join('\n\n')
    },
  }
}

export function toMatchGetRequest(actual, expected) {
  return toMatchRequest.bind(this)(actual, {...expected, method: 'GET'})
}

export function toMatchPatchRequest(actual, expected) {
  return toMatchRequest.bind(this)(actual, {...expected, method: 'PATCH'})
}

export function toMatchPostRequest(actual, expected) {
  return toMatchRequest.bind(this)(actual, {...expected, method: 'POST'})
}

export function toMatchDeleteRequest(actual, expected) {
  return toMatchRequest.bind(this)(actual, {...expected, method: 'DELETE'})
}

export function toMatchPutRequest(actual, expected) {
  return toMatchRequest.bind(this)(actual, {...expected, method: 'PUT'})
}
