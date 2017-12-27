import {createFetchMiddleware} from './fetch-middleware'

describe('src/app/js/store/middleware/fetch/fetch-middleware.spec.js', () => {

    let exchange, dispatch, next

    beforeEach(() => {
        exchange = jasmine.createSpy('exchange')
        dispatch = jasmine.createSpy('dispatch')
        next = jasmine.createSpy('next')
    })

    const execute = action => createFetchMiddleware(exchange)({dispatch})(next)(action)
    const resolve = value => exchange.and.callFake(() => () => Promise.resolve(value))
    const reject = value => exchange.and.callFake(() => () => Promise.reject(value))

    const anAction = () => {
        return {
            type: 'POST_SOMETHING',
            url: 'test',
            body: {id: 1},
            headers: {
                'content-type': 'application/json'
            },
            success: response => `${response} dispatched from action.success`,
            error: response => `${response} dispatched from action.error`
        }
    }

    it('should call exchange with action data and extracted method', () => {
        resolve()
        execute(anAction())

        expect(exchange).toHaveBeenCalledWith({
            url: 'test',
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: {id: 1}
        })
    })

    it('should call exchange with empty headers when not set', () => {
        const action = anAction()
        delete action.headers

        resolve()
        execute(action)

        expect(exchange).toHaveBeenCalledWith({url: 'test', method: 'POST', headers: {}, body: {id: 1}})
    })

    it('should dispatch action when action type is not eligible for exchange', () => {
        resolve()
        execute({type: 'OTHER_ACTION'})

        expect(next).toHaveBeenCalledWith({type: 'OTHER_ACTION'})
        expect(exchange).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
    })

    it('should call success callback when exchange succeeded', done => {
        resolve('expected success')

        execute(anAction()).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalledWith('expected success dispatched from action.success')
            done()
        })
    })

    it('should call error callback when exchange failed', done => {
        reject('expected error')

        execute(anAction()).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalledWith('expected error dispatched from action.error')
            done()
        })
    })

    it('should not call success callback when success is not a function', done => {
        const action = anAction()
        action.success = 'not a function'
        resolve()

        execute(action).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
            done()
        })
    })

    it('should not call error callback when success is not a function', done => {
        const action = anAction()
        action.error = 'not a function'
        reject()

        execute(action).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
            done()
        })
    })

    it('should only forward action types starting with an HTTP verb to exchange', () => {
        const exchangeWithActionType = type => {
            resolve()
            execute({type: type, success: () => {}})
            return expect(exchange)
        }

        exchangeWithActionType('POST_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'POST'}))
        exchangeWithActionType('PUT_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'PUT'}))
        exchangeWithActionType('DELETE_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'DELETE'}))
        exchangeWithActionType('PATCH_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'PATCH'}))
        exchangeWithActionType('GET_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'GET'}))
        exchangeWithActionType('HEAD_SOMETHING').toHaveBeenCalledWith(jasmine.objectContaining({method: 'HEAD'}))
    })
})
