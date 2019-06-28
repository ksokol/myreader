import {PendingFetchInterceptor} from './PendingFetchInterceptor'

describe('PendingFetchInterceptor', () => {

  let dispatch, interceptor

  beforeEach(() => {
    dispatch = jest.fn()
    interceptor = new PendingFetchInterceptor(dispatch)
  })

  it('should dispatch action FETCH_START when function "onBefore" called', () => {
    interceptor.onBefore()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_START'
    })
  })

  it('should dispatch action FETCH_END when function "onThen" called', () => {
    interceptor.onThen(null, jest.fn())

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_END'
    })
  })

  it('should called next', () => {
    const next = jest.fn()
    const response = 'expectedResponse'
    interceptor.onThen(response, next)

    expect(next).toHaveBeenCalledWith(response)
  })
})
