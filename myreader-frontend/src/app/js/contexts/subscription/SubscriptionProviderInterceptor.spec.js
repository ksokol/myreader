import {SubscriptionProviderInterceptor} from './SubscriptionProviderInterceptor'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

describe('SubscriptionProviderInterceptor', () => {

  let cb, interceptor, validRequest, response

  beforeEach(() => {
    cb = jest.fn()
    interceptor = new SubscriptionProviderInterceptor(cb)

    validRequest = {
      url: `${SUBSCRIPTION_ENTRIES}/uuid1`,
      method: 'PATCH',
      context: {oldValue: {uuid: 'uuid1'}}
    }
    response = {a: 'b'}
  })

  it('should not trigger callback when request context is undefined', () => {
    delete validRequest.context

    interceptor.onBefore(validRequest)
    interceptor.onThen(validRequest)

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when request context is an empty object', () => {
    interceptor.onBefore({...validRequest, context: {}})
    interceptor.onThen({...validRequest, context: {}})

    expect(cb).not.toHaveBeenCalled()
  })


  it('should not trigger callback when request context.oldValue is empty', () => {
    interceptor.onBefore({...validRequest, context: {oldValue: {}}})
    interceptor.onThen({...validRequest, context: {oldValue: {}}})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when request method is not PATCH', () => {
    interceptor.onBefore({...validRequest, method: 'GET'})
    interceptor.onThen({...validRequest, method: 'GET'})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when uuid in onThen function does not match', () => {
    interceptor.onBefore({...validRequest})
    interceptor.onThen({...validRequest, url: `${SUBSCRIPTION_ENTRIES}/uuid2`})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when url does not contain an uuid', () => {
    interceptor.onBefore({...validRequest, url: `${SUBSCRIPTION_ENTRIES}/`})
    interceptor.onThen({...validRequest, url: `${SUBSCRIPTION_ENTRIES}/`})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when url does not match pattern', () => {
    const url = 'other/uuid1'
    interceptor.onBefore({...validRequest, url})
    interceptor.onThen({...validRequest, url})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should not trigger callback when request.url in onThen function does not match', () => {
    interceptor.onBefore(validRequest)
    interceptor.onThen({...validRequest, url: 'other/uuid2'})

    expect(cb).not.toHaveBeenCalled()
  })

  it('should trigger callback', () => {
    interceptor.onBefore(validRequest)
    interceptor.onThen(validRequest, response)

    expect(cb).toHaveBeenCalledWith(response, {uuid: 'uuid1'})
  })

  it('should trigger callback only once', () => {
    interceptor.onBefore(validRequest)
    interceptor.onThen(validRequest, response)

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should not trigger callback when request failed', () => {
    interceptor.onBefore(validRequest)
    interceptor.onError(validRequest)
    interceptor.onThen(validRequest)

    expect(cb).not.toHaveBeenCalled()
  })

  it('should trigger callback when request method matches', () => {
    interceptor.onBefore({...validRequest, method: 'GET'})
    interceptor.onBefore(validRequest)
    interceptor.onError({...validRequest, method: 'GET'})
    interceptor.onThen(validRequest, response)

    expect(cb).toHaveBeenCalledWith(response, {uuid: 'uuid1'})
  })

  it('should trigger callback when request url matches', () => {
    interceptor.onBefore({...validRequest, url: `${SUBSCRIPTION_ENTRIES}/uuid2`})
    interceptor.onBefore(validRequest)
    interceptor.onError({...validRequest, url: `${SUBSCRIPTION_ENTRIES}/uuid2`})
    interceptor.onThen(validRequest, response)

    expect(cb).toHaveBeenCalledWith(response, {uuid: 'uuid1'})
  })
})
