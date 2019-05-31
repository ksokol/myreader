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

  it('should dispatch action FETCH_END when function "onFinally" called', () => {
    interceptor.onFinally()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_END'
    })
  })
})
