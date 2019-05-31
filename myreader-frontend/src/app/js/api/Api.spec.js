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
    const interceptor = data => ({
      onThen: (response, next) => {
        next({...response, ...data})
      }
    })

    api.addInterceptor(interceptor({c: 'd'}))
    api.addInterceptor(interceptor({e: 'f'}))

    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({a: 'b', c: 'd', e: 'f'})
      done()
    })
  })

  it('should not resolve promise when interceptor suppresses chain', done => {
    const interceptor = {
      onThen: () => {}
    }

    jest.useRealTimers()
    let resolved = false

    api.addInterceptor(interceptor)
    api.request({}).then(() => resolved = true)

    setTimeout(() => {
      if (resolved) {
        fail('should not resolve promise')
      }
      done()
    }, 500)
  })

  it('should not trigger interceptor when function "onThen" is absent', done => {
    const interceptor = {
      otherName: (response, next) => {
        next({data: 'unexpected'})
      }
    }

    api.addInterceptor(interceptor)

    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({a: 'b'})
      done()
    })
  })
})
