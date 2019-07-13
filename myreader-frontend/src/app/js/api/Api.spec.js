import {Api} from './Api'
import {exchange} from './exchange'
import {flushPromises} from '../shared/test-utils'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

const expectedError = 'expected error'

describe('Api', () => {

  let api

  const onBeforeInterceptor = onBefore => ({onBefore})
  const onThenInterceptor = onThen => ({onThen})
  const onErrorInterceptor = onError => ({onError})
  const onFinallyInterceptor = onFinally => ({onFinally})
  const otherInterceptor = otherName => ({otherName})

  beforeEach(() => {
    exchange.mockImplementation(request => Promise.resolve(request))

    api = new Api()
  })

  it('should return promise with expected response', done => {
    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({a: 'b'})
      done()
    })
  })

  it('should call configure onThen interceptors', done => {
    const interceptor1 = jest.fn()
    const interceptor2 = jest.fn()

    api.addInterceptor(onThenInterceptor(interceptor1))
    api.addInterceptor(onThenInterceptor(interceptor2))

    api.request({a: 'b'}).then(() => {
      expect(interceptor1).toHaveBeenCalledWith({a: 'b'})
      expect(interceptor2).toHaveBeenCalledWith({a: 'b'})
      done()
    })
  })

  it('should not trigger interceptor when function "onThen" is absent', done => {
    const interceptor = jest.fn()

    api.addInterceptor(otherInterceptor(interceptor))

    api.request({a: 'b'}).then(() => {
      expect(interceptor).not.toHaveBeenCalled()
      done()
    })
  })

  it('should trigger interceptors with function "onBefore"', done => {
    const interceptor1 = jest.fn()
    const interceptor2 = jest.fn()

    api.addInterceptor(onBeforeInterceptor(interceptor1))
    api.addInterceptor(onBeforeInterceptor(interceptor2))

    api.request({c: 'd'}).then(() => {
      expect(interceptor1).toHaveBeenCalledWith({c: 'd'})
      expect(interceptor2).toHaveBeenCalledWith({c: 'd'})
      done()
    })
  })

  it('should trigger interceptors with function "onError"', done => {
    const interceptor1 = jest.fn()
    const interceptor2 = jest.fn()

    api.addInterceptor(onErrorInterceptor(interceptor1))
    api.addInterceptor(onErrorInterceptor(interceptor2))

    exchange.mockImplementationOnce(() => Promise.reject(expectedError))

    api.request({}).catch(() => {
      expect(interceptor1).toHaveBeenCalledWith(expectedError)
      expect(interceptor2).toHaveBeenCalledWith(expectedError)
      done()
    })
  })

  it('should trigger interceptors with function "onFinally"', async done => {
    const interceptor1 = jest.fn()
    const interceptor2 = jest.fn()

    api.addInterceptor(onFinallyInterceptor(interceptor1))
    api.addInterceptor(onFinallyInterceptor(interceptor2))

    const promise = api.request({})
    await flushPromises()

    promise.finally(() => {
      expect(interceptor1).toHaveBeenCalled()
      expect(interceptor2).toHaveBeenCalled()
      done()
    })
  })
})
