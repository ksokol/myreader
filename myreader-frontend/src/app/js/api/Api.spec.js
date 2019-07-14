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
  const otherInterceptor = otherFn => ({otherFn})

  beforeEach(() => {
    exchange.mockImplementation(() => Promise.resolve({c: 'd'}))

    api = new Api()
  })

  it('should return promise with expected response', done => {
    api.request({a: 'b'}).then(response => {
      expect(response).toEqual({c: 'd'})
      done()
    })
  })

  it('should trigger interceptors with function "onThen"', done => {
    const interceptor1 = onThenInterceptor(jest.fn())
    const interceptor2 = onThenInterceptor(jest.fn())

    api.addInterceptor(interceptor1)
    api.addInterceptor(interceptor2)

    api.request({a: 'b'}).then(() => {
      expect(interceptor1.onThen).toHaveBeenCalledWith({a: 'b', context: {}}, {c: 'd'})
      expect(interceptor2.onThen).toHaveBeenCalledWith({a: 'b', context: {}}, {c: 'd'})
      done()
    })
  })

  it('should not trigger interceptor when function "onThen" is absent', done => {
    const interceptor = otherInterceptor(jest.fn())

    api.addInterceptor(interceptor)

    api.request({a: 'b'}).then(() => {
      expect(interceptor.otherFn).not.toHaveBeenCalled()
      done()
    })
  })

  it('should trigger interceptors with function "onBefore"', done => {
    const interceptor1 = onBeforeInterceptor(jest.fn())
    const interceptor2 = onBeforeInterceptor(jest.fn())

    api.addInterceptor(interceptor1)
    api.addInterceptor(interceptor2)

    api.request({c: 'd'}).then(() => {
      expect(interceptor1.onBefore).toHaveBeenCalledWith({c: 'd', context: {}})
      expect(interceptor2.onBefore).toHaveBeenCalledWith({c: 'd', context: {}})
      done()
    })
  })

  it('should trigger interceptors with function "onError"', done => {
    const interceptor1 = onErrorInterceptor(jest.fn())
    const interceptor2 = onErrorInterceptor(jest.fn())

    api.addInterceptor(interceptor1)
    api.addInterceptor(interceptor2)

    exchange.mockImplementationOnce(() => Promise.reject(expectedError))

    api.request({a: 'b'}).catch(() => {
      expect(interceptor1.onError).toHaveBeenCalledWith({a: 'b', context: {}}, expectedError)
      expect(interceptor2.onError).toHaveBeenCalledWith({a: 'b', context: {}}, expectedError)
      done()
    })
  })

  it('should trigger interceptors with function "onFinally"', async done => {
    const interceptor1 = onFinallyInterceptor(jest.fn())
    const interceptor2 = onFinallyInterceptor(jest.fn())

    api.addInterceptor(interceptor1)
    api.addInterceptor(interceptor2)

    const promise = api.request({})
    await flushPromises()

    promise.finally(() => {
      expect(interceptor1.onFinally).toHaveBeenCalled()
      expect(interceptor2.onFinally).toHaveBeenCalled()
      done()
    })
  })

  it('should not trigger removed interceptor', async done => {
    const interceptor1 = onThenInterceptor(jest.fn())
    const interceptor2 = onThenInterceptor(jest.fn())

    api.addInterceptor(interceptor2)
    api.addInterceptor(interceptor1)
    api.removeInterceptor(interceptor2)

    api.request({}).then(() => {
      expect(interceptor1.onThen).toHaveBeenCalled()
      expect(interceptor2.onThen).not.toHaveBeenCalled()
      done()
    })
  })

  it('should trigger interceptors with function "onThen" and context', done => {
    const interceptor = onThenInterceptor(jest.fn())

    api.addInterceptor(interceptor)

    api.request({a: 'b', context: {e: 'f'}}).then(() => {
      expect(interceptor.onThen).toHaveBeenCalledWith({a: 'b', context: {e: 'f'}}, {c: 'd'})
      done()
    })
  })

  it('should trigger interceptors with function "onError" and context', done => {
    const interceptor = onErrorInterceptor(jest.fn())

    api.addInterceptor(interceptor)

    exchange.mockImplementationOnce(() => Promise.reject(expectedError))

    api.request({a: 'b', context: {e: 'f'}}).catch(() => {
      expect(interceptor.onError).toHaveBeenCalledWith({a: 'b', context: {e: 'f'}}, expectedError)
      done()
    })
  })
})
