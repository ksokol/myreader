import {responseHandler} from './response-handler'
import {createMockStore} from '../../../shared/test-utils'

describe('src/app/js/store/middleware/fetch/response-handler.spec.js', () => {

    let store, actual

    beforeEach(() => store = createMockStore())

    const givenHandledResponse = (action, response) => {
        actual = responseHandler(action, response)
        actual.actions.forEach(action => store.dispatch(action))
        return actual
    }

    it('should dispatch actions FETCH_END and SECURITY_UPDATE when request is unauthorized', () => {
        givenHandledResponse({}, {status: 401, data: 'response'})

        expect(actual).toContainObject({ok: false})
        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
        expect(store.getActions()[1]).toEqual({type: 'SECURITY_UPDATE', authorized: false, role: ''})
    })

    it('should dispatch action FETCH_END when request returns HTTP 400', () => {
        givenHandledResponse({}, {ok: false, status: 400, data: 'response'})

        expect(actual).toContainObject({ok: false})
        expect(store.getActions().length).toEqual(1)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
    })

    it('should dispatch actions SHOW_NOTIFICATION and FETCH_END when request returns HTTP 500', () => {
        givenHandledResponse({}, {ok: false, status: 500, data: 'response'})

        expect(actual).toContainObject({ok: false})
        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[0]).toContainObject({type: 'SHOW_NOTIFICATION', notification: {text: 'response'}})
        expect(store.getActions()[1]).toEqualActionType('FETCH_END')
    })

    it('should dispatch actions FETCH_END and ERROR_ACTION when request returns HTTP 500 and error callback is single action', () => {
        givenHandledResponse({error: response => {return {type: 'ERROR_ACTION', response}}}, {ok: false, status: 500, data: 'response'})

        expect(actual).toContainObject({ok: false})
        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
        expect(store.getActions()[1]).toEqual({type: 'ERROR_ACTION', response: 'response'})
    })

    it('should dispatch actions FETCH_END, ERROR_ACTION1 and ERROR_ACTION2 when request returns HTTP 500 and error callback contains multiple actions', () => {
        givenHandledResponse(
            {error: [response => {return {type: 'ERROR_ACTION1', response}}, response => {return {type: 'ERROR_ACTION2', response}}]},
            {ok: false, status: 500, data: 'response'}
        )

        expect(actual).toContainObject({ok: false})
        expect(store.getActions().length).toEqual(3)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
        expect(store.getActions()[1]).toEqual({type: 'ERROR_ACTION1', response: 'response'})
        expect(store.getActions()[2]).toEqual({type: 'ERROR_ACTION2', response: 'response'})
    })

    it('should dispatch action FETCH_END when request returns HTTP 200', () => {
        givenHandledResponse({}, {ok: true, status: 200, data: 'response'})

        expect(actual).toContainObject({ok: true})
        expect(store.getActions().length).toEqual(1)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
    })

    it('should dispatch actions FETCH_END and SUCCESS_ACTION when request returns HTTP 200 and success callback is single action', () => {
        givenHandledResponse({success: response => {return {type: 'SUCCESS_ACTION', response}}}, {ok: true, status: 200, data: 'response'})

        expect(actual).toContainObject({ok: true})
        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
        expect(store.getActions()[1]).toEqual({type: 'SUCCESS_ACTION', response: 'response'})
    })

    it('should dispatch actions FETCH_END, SUCCESS_ACTION1 and SUCCESS_ACTION2 when request returns HTTP 200 and error callback contains multiple actions', () => {
        givenHandledResponse(
            {success: [response => {return {type: 'SUCCESS_ACTION1', response}}, response => {return {type: 'SUCCESS_ACTION2', response}}]},
            {ok: true, status: 200, data: 'response'}
        )

        expect(actual).toContainObject({ok: true})
        expect(store.getActions().length).toEqual(3)
        expect(store.getActions()[0]).toEqualActionType('FETCH_END')
        expect(store.getActions()[1]).toEqual({type: 'SUCCESS_ACTION1', response: 'response'})
        expect(store.getActions()[2]).toEqual({type: 'SUCCESS_ACTION2', response: 'response'})
    })

    it('should pass response headers to success callback', () => {
        givenHandledResponse({success: (response, headers) => {return {type: 'SUCCESS_ACTION', headers}}}, {ok: true, headers: {a: 'b', c: 'd'}})

        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[1]).toEqual({type: 'SUCCESS_ACTION', headers: {a: 'b', c: 'd'}})
    })

    it('should pass response headers to error callback', () => {
        givenHandledResponse({error: (response, headers) => {return {type: 'ERROR_ACTION', headers}}}, {ok: false, headers: {a: 'b', c: 'd'}})

        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[1]).toEqual({type: 'ERROR_ACTION', headers: {a: 'b', c: 'd'}})
    })

    it('should pass response status to success callback', () => {
        givenHandledResponse({success: (response, headers, status) => {return {type: 'SUCCESS_ACTION', status}}}, {ok: true, status: 200})

        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[1]).toEqual({type: 'SUCCESS_ACTION', status: 200})
    })

    it('should pass response status to error callback', () => {
        givenHandledResponse({error: (response, headers, status) => {return {type: 'ERROR_ACTION', status}}}, {ok: false, status: 404})

        expect(store.getActions().length).toEqual(2)
        expect(store.getActions()[1]).toEqual({type: 'ERROR_ACTION', status: 404})
    })

    it('should not dispatch action when success callback returns null', () => {
        givenHandledResponse({success: () => null}, {ok: true})

        expect(store.getActionTypes()).toEqual(['FETCH_END'])
    })

    it('should not dispatch action when success callback returns array with null', () => {
        givenHandledResponse({success: [() => null]}, {ok: true})

        expect(store.getActionTypes()).toEqual(['FETCH_END'])
    })

    it('should not dispatch action when error callback returns null', () => {
        givenHandledResponse({error: () => null}, {ok: false})

        expect(store.getActionTypes()).toEqual(['FETCH_END'])
    })

    it('should not dispatch action when error callback returns array with null', () => {
        givenHandledResponse({error: [() => null]}, {ok: false})

        expect(store.getActionTypes()).toEqual(['FETCH_END'])
    })
})
