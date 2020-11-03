class Headers {

  constructor(headers) {
    this._headers = headers || {}
  }

  get(key) {
    return this._headers[key]
  }

  entries() {
    return Object.entries(this._headers)
  }
}

class Request {

  constructor(input, init = {}) {
    this.url = input
    Object.assign(this, init)
  }
}

class Response {

  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.ok = this.status >= 200 && this.status <= 299
    this.headers = new Headers(init.headers)
  }

  text() {
    return Promise.resolve(this.body)
  }

  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

/**
 * MIT License
 *
 * Copyright (c) 2017 Jeff Lau
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * @see https://github.com/jefflau/jest-fetch-mock/blob/7015f40f11167ad27aa73a5cf804db7c8953edff/src/index.js
 */
const ActualResponse = Response

function ResponseWrapper(body, init) {
  if (
    body &&
    typeof body.constructor === 'function' &&
    body.constructor.__isFallback
  ) {
    const response = new ActualResponse(null, init)
    response.body = body

    const actualClone = response.clone
    response.clone = () => {
      const clone = actualClone.call(response)
      const [body1, body2] = body.tee()
      response.body = body1
      clone.body = body2
      return clone
    }

    return response
  }

  return new ActualResponse(body, init)
}

const isFn = unknown => typeof unknown === 'function'

const normalizeResponse = (bodyOrFunction, init) => () => isFn(bodyOrFunction) ?
  bodyOrFunction().then(({body, init}) => new ResponseWrapper(body, init)) :
  Promise.resolve(new ResponseWrapper(bodyOrFunction, init))

const normalizeError = errorOrFunction =>  isFn(errorOrFunction) ?
  errorOrFunction :
  () => Promise.reject(errorOrFunction)

const fetch = jest.fn()
fetch.Headers = Headers
fetch.Response = ResponseWrapper
fetch.Request = Request
fetch.mockResponse = (bodyOrFunction, init) => fetch.mockImplementation(normalizeResponse(bodyOrFunction, init))

fetch.mockReject = errorOrFunction => fetch.mockImplementation(normalizeError(errorOrFunction))

const mockResponseOnce = (bodyOrFunction, init) => fetch.mockImplementationOnce(normalizeResponse(bodyOrFunction, init))

fetch.mockResponseOnce = mockResponseOnce

fetch.once = mockResponseOnce

fetch.mockRejectOnce = errorOrFunction => fetch.mockImplementationOnce(normalizeError(errorOrFunction))

fetch.mockResponses = (...responses) => {
  responses.forEach(([bodyOrFunction, init]) => fetch.mockImplementationOnce(normalizeResponse(bodyOrFunction, init)))
  return fetch
}

fetch.resetMocks = () => {
  fetch.mockReset()
}

// custom
fetch.requestCount = () => {
  return fetch.mock.calls.length
}

fetch.mostRecent = () => {
  return fetch.mock.calls[fetch.requestCount() - 1][0]
}

fetch.first = () => {
  return fetch.mock.calls[0][0]
}

fetch.jsonResponse = object => {
  fetch.mockResponse(JSON.stringify(object), {headers: {'content-type': 'application/json'}})
}

fetch.jsonResponseOnce = object => {
  fetch.mockResponseOnce(JSON.stringify(object), {headers: {'content-type': 'application/json'}})
}

fetch.responsePending = () => {
  fetch.mockResponseOnce(() => new Promise(() => { /* simulate pending request */ }))
}

fetch.rejectResponse = error => {
  fetch.mockResponseOnce(() => Promise.reject(error))
}
//custom end

// Default mock is just an empty string.
fetch.mockResponse('')

global.fetch = fetch
global.Headers = Headers
global.Request = Request

afterEach(() => {
  fetch.mockReset()
  fetch.mockResponse('')
})
