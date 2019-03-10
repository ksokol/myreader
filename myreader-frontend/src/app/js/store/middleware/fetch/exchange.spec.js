import {exchange} from './exchange'
import '../../../../../../__mocks__/global/fetch'

describe('exchange', () => {

  const execute = (method, params) => exchange({...params, method})

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
      expect(fetch.mock.calls[0][0].headers.get('content-type')).toEqual('application/json')
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
    execute('POST', {url: '', body: '{id: 1}', headers: {'Content-type': 'text/plain'}}).then(() => {
      expect(fetch.mock.calls[0][0].headers.get('content-type')).toEqual('text/plain')
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
    fetch.once('{"id": 1}', {headers: {'content-type': 'application/json'}})

    execute('GET').then(response => {
      expect(response).toContainObject({ok: true, status: 200, data: {id: 1}})
      done()
    })
  })

  it('should return text body when http request succeeded', done => {
    fetch.once('expected body', {headers: {'content-type': 'text/plain'}})

    execute('POST').then(response => {
      expect(response).toContainObject({ok: true, status: 200, data: 'expected body'})
      done()
    })
  })

  it('should return json body when http request is unauthorized', done => {
    fetch.once('{"id": 1}', {status: 401, headers: {'content-type': 'application/json'}})

    execute('POST').then(response => {
      expect(response).toContainObject({ok: false, status: 401, data: {id: 1}})
      done()
    })
  })

  it('should return text body when http request is unauthorized', done => {
    fetch.once('expected body', {status: 401, headers: {'content-type': 'text/plain'}})

    execute('POST').then(response => {
      expect(response).toContainObject({ok: false, status: 401, data: 'expected body'})
      done()
    })
  })

  it('should return json body when http request failed', done => {
    fetch.once('{"id": 1}', {status: 400, headers: {'content-type': 'application/json'}})

    execute('POST').then(response => {
      expect(response).toContainObject({ok: false, status: 400, data: {id: 1}})
      done()
    })
  })

  it('should return text body when http request failed', done => {
    fetch.once('expected body', {status: 400, headers: {'content-type': 'text/plain'}})

    execute('POST').then(response => {
      expect(response).toContainObject({ok: false, status: 400, data: 'expected body'})
      done()
    })
  })

  it('should return all headers when response is of type text/plain', done => {
    fetch.once('{"id": 1}', {status: 401, headers: {'content-type': 'text/plain', a: 'b'}})

    execute('POST').then(response => {
      expect(response).toContainObject({headers: {'content-type': 'text/plain', a: 'b'}})
      done()
    })
  })

  it('should return all headers when response is of type application/json', done => {
    fetch.once('{"id": 1}', {status: 401, headers: {'content-type': 'application/json', a: 'b'}})

    execute('POST').then(response => {
      expect(response).toContainObject({headers: {'content-type': 'application/json', a: 'b'}})
      done()
    })
  })

  it('should return empty headers when http request failed for unknown reason', done => {
    fetch.mockRejectOnce('expected error')

    execute('POST').then(response => {
      expect(response).toContainObject({headers: {}})
      done()
    })
  })

  it('should return text error message when http request failed for unknown reason', done => {
    fetch.mockRejectOnce('expected error')

    execute('POST').then(response => {
      expect(response).toContainObject({ok: false, status: -1, data: 'expected error'})
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
