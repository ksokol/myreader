import {exchange} from './exchange'
import '../../../../__mocks__/global/fetch'

const jsonContentType = 'application/json'
const textPlainContentType = 'text/plain'
const expectedBody = 'expected body'

const execute = (method, params) => exchange({...params, method})

describe('exchange', () => {

  afterEach(() => {
    fetch.resetMocks()
    fetch.mockResponse('')
  })

  it('should GET resource', done => {
    execute('GET', {url: 'test'}).then(() => {
      expect(fetch.mock.calls[0][0].url).toEqual('test')
      expect(fetch.mock.calls[0][0].method).toEqual('GET')
      done()
    })
  })

  it('should POST to resource', done => {
    execute('POST', {url: 'test'}).then(() => {
      expect(fetch.mock.calls[0][0].url).toEqual('test')
      expect(fetch.mock.calls[0][0].method).toEqual('POST')
      done()
    })
  })

  it('should use default content-type "application/json"', done => {
    execute('POST', {url: 'test', body: {id: 1}}).then(() => {
      expect(fetch.mock.calls[0][0].headers.get('content-type')).toEqual(jsonContentType)
      done()
    })
  })

  it('should add x-requested-with header', done => {
    execute('POST', {url: '', body: {id: 1}}).then(() => {
      expect(fetch.mock.calls[0][0].headers.get('x-requested-with')).toEqual('XMLHttpRequest')
      done()
    })
  })

  it('should use given content-type', done => {
    execute('POST', {url: '', body: '{id: 1}', headers: {'Content-type': textPlainContentType}}).then(() => {
      expect(fetch.mock.calls[0][0].headers.get('content-type')).toEqual(textPlainContentType)
      done()
    })
  })


  it('should include credentials', done => {
    execute('GET', {url: '/'}).then(() => {
      expect(fetch.mock.calls[0][0].credentials).toEqual('same-origin')
      done()
    })
  })

  it('should return json body when http request succeeded', done => {
    fetch.once('{"id": 1}', {headers: {'content-type': jsonContentType}})

    execute('GET').then(response => {
      expect(response).toEqual({id: 1})
      done()
    })
  })

  it('should return text body when http request succeeded', done => {
    fetch.once(expectedBody, {headers: {'content-type': 'text/plain'}})

    execute('POST').then(response => {
      expect(response).toEqual(expectedBody)
      done()
    })
  })

  it('should return json body when http request is unauthorized', done => {
    fetch.once('{"id": 1}', {status: 401, headers: {'content-type': jsonContentType}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 401,
        headers: {'content-type': jsonContentType},
        data: {id: 1}
      })
      done()
    })
  })

  it('should return text body when http request is unauthorized', done => {
    fetch.once(expectedBody, {status: 401, headers: {'content-type': textPlainContentType}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 401,
        headers: {'content-type': textPlainContentType},
        data: expectedBody
      })
      done()
    })
  })

  it('should return json body when http request failed', done => {
    fetch.once('{"id": 1}', {status: 400, headers: {'content-type': jsonContentType}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 400,
        headers: {'content-type': jsonContentType},
        data: {id: 1}
      })
      done()
    })
  })

  it('should return text body when http request failed', done => {
    fetch.once(expectedBody, {status: 400, headers: {'content-type': textPlainContentType}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 400,
        headers: {'content-type': textPlainContentType},
        data: expectedBody
      })
      done()
    })
  })

  it('should return all headers when response is of type text/plain', done => {
    fetch.once(expectedBody, {status: 401, headers: {'content-type': textPlainContentType, a: 'b'}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 401,
        headers: {'content-type': textPlainContentType, a: 'b'},
        data: expectedBody
      })
      done()
    })
  })

  it('should return all headers when response is of type application/json', done => {
    fetch.once('{"id": 1}', {status: 401, headers: {'content-type': jsonContentType, a: 'b'}})

    execute('POST').catch(response => {
      expect(response).toEqual({
        status: 401,
        headers: {'content-type': jsonContentType, a: 'b'},
        data: {id: 1}
      })
      done()
    })
  })

  it('should return empty headers when http request failed for unknown reason', done => {
    fetch.mockRejectOnce(new Error('expected error'))

    execute('POST').catch(response => {
      expect(response).toEqual({
        data: 'Error: expected error',
        headers: {},
        status: -1
      })
      done()
    })
  })

  it('should ignore body when http method is GET', done => {
    execute('GET', {url: 'test', body: 'a body'}).then(() => done())
  })

  it('should ignore body when http method is HEAD', done => {
    execute('HEAD').then(() => done())
  })
})
