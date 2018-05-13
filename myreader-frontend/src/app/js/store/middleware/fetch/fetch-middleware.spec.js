import {createFetchMiddleware} from './fetch-middleware'

describe('src/app/js/store/middleware/fetch/fetch-middleware.spec.js', () => {

    let dispatch, next, exchangeHandler

    beforeEach(() => {
        dispatch = 'expected dispatch'
        next = jest.fn()
        exchangeHandler = jest.fn()
    })

    const execute = action => createFetchMiddleware(exchangeHandler)({dispatch})(next)(action)

    it('should dispatch action when action type is not eligible for exchange', () => {
        execute({type: 'OTHER_ACTION'})

        expect(next).toHaveBeenCalledWith({type: 'OTHER_ACTION'})
        expect(exchangeHandler).not.toHaveBeenCalled()
    })

    it('should call exchangeHandler with action', () => {
        const action = {type: 'POST_SOMETHING', payload: 'expected payload'}
        execute(action)

        expect(exchangeHandler).toHaveBeenCalledWith(action, 'expected dispatch')
    })

    it('should only forward actions to exchangeHandler when type starts with an HTTP verb', () => {
        const exchangeWithActionType = type => {
            execute({type})
            expect(exchangeHandler.mock.calls).toEqual([[{type}, 'expected dispatch']])
            exchangeHandler.mockClear()
        }

        exchangeWithActionType('POST_SOMETHING')
        exchangeWithActionType('PUT_SOMETHING')
        exchangeWithActionType('DELETE_SOMETHING')
        exchangeWithActionType('PATCH_SOMETHING')
        exchangeWithActionType('GET_SOMETHING')
        exchangeWithActionType('HEAD_SOMETHING')
    })
})
