import {authInterceptor} from './authInterceptor'

describe('authInterceptor', () => {

  let dispatch, interceptor, next

  beforeEach(() => {
    dispatch = jest.fn()
    next = jest.fn()
    interceptor = authInterceptor(dispatch)
  })

  it('should dispatch action SECURITY_UPDATE when status is 401', () => {
    interceptor({status: 401}, next)

    expect(dispatch).toHaveBeenCalledWith({
      authorized: false,
      roles: [],
      type: 'SECURITY_UPDATE'
    })
  })

  it('should dispatch action SECURITY_UPDATE when status is 401', () => {
    interceptor({status: 401}, next)

    expect(next).not.toHaveBeenCalled()
  })

  it('should not dispatch action SECURITY_UPDATE when status is 200', () => {
    interceptor({status: 200}, next)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should not dispatch action SECURITY_UPDATE when status is 200', () => {
    interceptor({status: 200}, next)

    expect(next).toHaveBeenCalledWith({status: 200})
  })
})
