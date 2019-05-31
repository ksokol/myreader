import {Api} from './Api'

jest.mock('./exchange', () => ({
  exchange: request => Promise.resolve(request)
}))

describe('Api', () => {

  let api

  beforeEach(() => {
    api = new Api()
  })

  it('should return promise with expected response', done => {
    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({a: 'b'})
      done()
    })
  })

  it('should return promise with response expanded by interceptors', done => {
    api.addResponseInterceptor((response, next) => next({...response, c: 'd'}))
    api.addResponseInterceptor((response, next) => next({...response, e: 'f'}))

    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({a: 'b', c: 'd', e: 'f'})
      done()
    })
  })

  it('should not resolve promise when interceptor suppresses chain', done => {
    jest.useRealTimers()
    let resolved = false

    api.addResponseInterceptor(() => {})
    api.request({}).then(() => resolved = true)

    setTimeout(() => {
      if (resolved) {
        fail("should not resolve promise")
      }
      done()
    }, 500)
  })
})
