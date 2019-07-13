import {AuthInterceptor} from './AuthInterceptor'

describe('AuthInterceptor', () => {

  let dispatch, interceptor

  beforeEach(() => {
    dispatch = jest.fn()
    interceptor = new AuthInterceptor(dispatch)
  })

  it('should dispatch action SECURITY_UPDATE when status is 401', () => {
    interceptor.onError({status: 401})

    expect(dispatch).toHaveBeenCalledWith({
      authorized: false,
      roles: [],
      type: 'SECURITY_UPDATE'
    })
  })

  it('should not dispatch action SECURITY_UPDATE when status is 200', () => {
    interceptor.onError({status: 200})

    expect(dispatch).not.toHaveBeenCalled()
  })
})
