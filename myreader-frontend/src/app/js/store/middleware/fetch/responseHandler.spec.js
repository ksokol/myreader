import {responseHandler} from './responseHandler'
import {createMockStore} from '../../../shared/test-utils'

describe('responseHandler', () => {

  let store, actual

  beforeEach(() => store = createMockStore([]))

  const givenHandledResponse = (action, response) => {
    actual = responseHandler(action, response)
    actual.actions.forEach(action => store.dispatch(action))
    return actual
  }

  it('should dispatch action SHOW_NOTIFICATION when request returns HTTP 500', () => {
    givenHandledResponse({}, {ok: false, status: 500, data: 'response'})

    expect(actual).toContainObject({ok: false})
    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'response'}})
  })

  it('should dispatch action SHOW_NOTIFICATION with serialized response object when request returns HTTP 500', () => {
    givenHandledResponse({}, {ok: false, status: 500, data: {a: 'b'}})

    expect(actual).toContainObject({ok: false})
    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toContainObject({
      type: 'SHOW_NOTIFICATION',
      notification: {
        text: JSON.stringify({
          ok: false,
          status: 500,
          data: {a: 'b'}
        })
      }
    })
  })

  it('should dispatch action ERROR_ACTION when request returns HTTP 500 and error callback is single action', () => {
    givenHandledResponse({
      error: response => {
        return {type: 'ERROR_ACTION', response}
      }
    }, {ok: false, status: 500, data: 'response'})

    expect(actual).toContainObject({ok: false})
    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'ERROR_ACTION', response: 'response'})
  })

  it('should dispatch actions ERROR_ACTION1 and ERROR_ACTION2 when request returns HTTP 500 and error callback contains multiple actions', () => {
    givenHandledResponse(
      {
        error: [response => {
          return {type: 'ERROR_ACTION1', response}
        }, response => {
          return {type: 'ERROR_ACTION2', response}
        }]
      },
      {ok: false, status: 500, data: 'response'}
    )

    expect(actual).toContainObject({ok: false})
    expect(store.getActions()).toHaveLength(2)
    expect(store.getActions()[0]).toEqual({type: 'ERROR_ACTION1', response: 'response'})
    expect(store.getActions()[1]).toEqual({type: 'ERROR_ACTION2', response: 'response'})
  })

  it('should dispatch action SUCCESS_ACTION when request returns HTTP 200 and success callback is single action', () => {
    givenHandledResponse({
      success: response => {
        return {type: 'SUCCESS_ACTION', response}
      }
    }, {ok: true, status: 200, data: 'response'})

    expect(actual).toContainObject({ok: true})
    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'SUCCESS_ACTION', response: 'response'})
  })

  it('should dispatch actions SUCCESS_ACTION1 and SUCCESS_ACTION2 when request returns HTTP 200 and error callback contains multiple actions', () => {
    givenHandledResponse(
      {
        success: [response => {
          return {type: 'SUCCESS_ACTION1', response}
        }, response => {
          return {type: 'SUCCESS_ACTION2', response}
        }]
      },
      {ok: true, status: 200, data: 'response'}
    )

    expect(actual).toContainObject({ok: true})
    expect(store.getActions()).toHaveLength(2)
    expect(store.getActions()[0]).toEqual({type: 'SUCCESS_ACTION1', response: 'response'})
    expect(store.getActions()[1]).toEqual({type: 'SUCCESS_ACTION2', response: 'response'})
  })

  it('should pass response headers to success callback', () => {
    givenHandledResponse({
      success: (response, headers) => {
        return {type: 'SUCCESS_ACTION', headers}
      }
    }, {ok: true, headers: {a: 'b', c: 'd'}})

    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'SUCCESS_ACTION', headers: {a: 'b', c: 'd'}})
  })

  it('should pass response headers to error callback', () => {
    givenHandledResponse({
      error: (response, headers) => {
        return {type: 'ERROR_ACTION', headers}
      }
    }, {ok: false, headers: {a: 'b', c: 'd'}})

    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'ERROR_ACTION', headers: {a: 'b', c: 'd'}})
  })

  it('should pass response status to success callback', () => {
    givenHandledResponse({
      success: (response, headers, status) => {
        return {type: 'SUCCESS_ACTION', status}
      }
    }, {ok: true, status: 200})

    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'SUCCESS_ACTION', status: 200})
  })

  it('should pass response status to error callback', () => {
    givenHandledResponse({
      error: (response, headers, status) => {
        return {type: 'ERROR_ACTION', status}
      }
    }, {ok: false, status: 404})

    expect(store.getActions()).toHaveLength(1)
    expect(store.getActions()[0]).toEqual({type: 'ERROR_ACTION', status: 404})
  })

  it('should not dispatch action when success callback returns null', () => {
    givenHandledResponse({success: () => null}, {ok: true})

    expect(store.getActionTypes()).toEqual([])
  })

  it('should not dispatch action when success callback returns array with null', () => {
    givenHandledResponse({success: [() => null]}, {ok: true})

    expect(store.getActionTypes()).toEqual([])
  })

  it('should not dispatch action when error callback returns null', () => {
    givenHandledResponse({error: () => null}, {ok: false})

    expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
  })

  it('should not dispatch action when error callback returns array with null', () => {
    givenHandledResponse({error: [() => null]}, {ok: false})

    expect(store.getActionTypes()).toEqual(['SHOW_NOTIFICATION'])
  })

  it('should dispatch finalize action when response succeeded', () => {
    givenHandledResponse({
      finalize: (data, headers, status) => ({type: 'FINALIZE_ACTION', data, headers, status})
    },
    {ok: true, data: 'expected data', headers: {a: 'b'}, status: 200}
    )

    expect(store.getActions()[0]).toEqual({
      type: 'FINALIZE_ACTION',
      data: 'expected data',
      headers: {a: 'b'},
      status: 200
    })
  })

  it('should dispatch finalize action when response failed', () => {
    givenHandledResponse({
      finalize: (data, headers, status) => ({
        type: 'FINALIZE_ACTION', data, headers, status})
    },
    {ok: false, data: 'expected data', headers: {a: 'b'}, status: 0}
    )

    expect(store.getActions()[1]).toEqual({
      type: 'FINALIZE_ACTION',
      data: 'expected data',
      headers: {a: 'b'},
      status: 0
    })
  })
})
