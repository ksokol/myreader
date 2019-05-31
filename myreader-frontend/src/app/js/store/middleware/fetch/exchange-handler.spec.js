import {createMockStore} from '../../../shared/test-utils'
import {createExchangeHandler} from './exchange-handler'
import arrayMiddleware from '../array/arrayMiddleware'

describe('exchangeHandler', () => {

  let exchange, store, responseHandler, exchangeHandler

  beforeEach(() => {
    store = createMockStore([arrayMiddleware])
    exchange = jest.fn()
    responseHandler = jest.fn()
    exchangeHandler = createExchangeHandler(exchange, responseHandler)
  })

  const resolve = value => exchange.mockResolvedValueOnce(value)
  const handleResponse = value => responseHandler.mockReturnValueOnce(value)

  it('should call exchange with given action and default headers when not set', done => {
    resolve({})
    handleResponse({ok: false, actions: []})

    exchangeHandler({type: 'GET_ACTION', url: 'expected url', body: 'expected body'}, store.dispatch).catch(() => {
      expect(exchange).toHaveBeenCalledWith({url: 'expected url', method: 'GET', headers: {}, body: 'expected body'})
      done()
    })
  })

  it('should call exchange with given action', done => {
    resolve({})
    handleResponse({ok: false, actions: []})

    exchangeHandler({
      type: 'GET_ACTION',
      url: 'expected url',
      headers: {a: 'b'},
      body: 'expected body'
    }, store.dispatch).catch(() => {
      expect(exchange).toHaveBeenCalledWith({
        url: 'expected url',
        method: 'GET',
        headers: {a: 'b'},
        body: 'expected body'
      })
      done()
    })
  })

  it('should call responseHandler with given action', done => {
    resolve({})
    handleResponse({ok: false, actions: []})

    exchangeHandler({type: 'GET_ACTION', url: 'expected url', body: 'expected body'}, store.dispatch).catch(() => done(
      expect(responseHandler).toHaveBeenCalledWith({type: 'GET_ACTION', url: 'expected url', body: 'expected body'}, {})
    ))
  })

  it('should call responseHandler with error response', done => {
    resolve({ok: false, data: 'expected response'})
    handleResponse({ok: false, actions: []})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).catch(() => {
      expect(responseHandler).toHaveBeenCalledWith({type: 'GET_ACTION'}, {ok: false, data: 'expected response'})
      done()
    })
  })

  it('should call responseHandler with success response', done => {
    resolve({ok: true, data: 'expected response'})
    handleResponse({ok: true, actions: []})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).then(() => {
      expect(responseHandler).toHaveBeenCalledWith({type: 'GET_ACTION'}, {ok: true, data: 'expected response'})
      done()
    })
  })

  it('should return error response', done => {
    resolve({ok: false, status: -1, data: 'expected response'})
    handleResponse({ok: false, actions: []})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).catch(error => {
      expect(error).toEqual({ok: false, status: -1, data: 'expected response'})
      done()
    })
  })

  it('should return success response', done => {
    resolve({ok: true, data: 'expected response'})
    handleResponse({ok: true, actions: []})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).then(response => {
      expect(response).toEqual('expected response')
      done()
    })
  })

  it('should dispatch actions returned by responseHandler when response succeeded', done => {
    resolve({ok: true, data: 'expected response'})
    handleResponse({ok: true, actions: [{type: 'SOME_ACTION1'}, {type: 'SOME_ACTION2'}]})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).then(() => {
      expect(store.getActionTypes()).toEqual(['SOME_ACTION1', 'SOME_ACTION2'])
      done()
    })
  })

  it('should dispatch actions returned by responseHandler when response failed', done => {
    resolve({ok: false, data: 'expected response'})
    handleResponse({ok: false, actions: [{type: 'SOME_ACTION1'}, {type: 'SOME_ACTION2'}]})

    exchangeHandler({type: 'GET_ACTION'}, store.dispatch).catch(() => {
      expect(store.getActionTypes()).toEqual(['SOME_ACTION1', 'SOME_ACTION2'])
      done()
    })
  })

  it('should dispatch before actions before calling exchange', () => {
    exchangeHandler({
      type: 'GET_ACTION',
      url: 'expected url',
      before: () => ([{type: 'EXPECTED_BEFORE1'}, {type: 'EXPECTED_BEFORE2'}])
    }, store.dispatch)

    expect(store.getActionTypes()).toEqual(['EXPECTED_BEFORE1', 'EXPECTED_BEFORE2'])
  })
})
