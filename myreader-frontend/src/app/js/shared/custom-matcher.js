import isMatch from 'lodash.ismatch'
import isEqual from 'lodash.isequal'

export function toContainObject(actual, expected) {
  return {
    pass: isMatch(actual, expected),
    message: () => `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`
  }
}

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
    const actualBody = JSON.parse(actual && actual.body || '')

    if (!isEqual(actualBody, expectedBody)) {
      actualValues.body = actualBody
      expectedValues.body = expectedBody
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
