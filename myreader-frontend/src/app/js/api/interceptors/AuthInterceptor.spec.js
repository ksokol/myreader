import {AuthInterceptor} from './AuthInterceptor'

describe('authInterceptor', () => {

  let dispatch, interceptor, next

  beforeEach(() => {
    dispatch = jest.fn()
    next = jest.fn()
    interceptor = new AuthInterceptor(dispatch)
  })

  it('should dispatch action SECURITY_UPDATE when status is 401', () => {
    interceptor.onThen({status: 401}, next)

    expect(dispatch).toHaveBeenCalledWith({
      authorized: false,
      roles: [],
      type: 'SECURITY_UPDATE'
    })
  })

  it('should not dispatch action SECURITY_UPDATE when status is 401', () => {
    interceptor.onThen({status: 401}, next)

    expect(next).not.toHaveBeenCalled()
  })

  it('should not dispatch action SECURITY_UPDATE when status is 200', () => {
    interceptor.onThen({status: 200}, next)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should called next when status is 200', () => {
    interceptor.onThen({status: 200}, next)

    expect(next).toHaveBeenCalledWith({status: 200})
  })
})
