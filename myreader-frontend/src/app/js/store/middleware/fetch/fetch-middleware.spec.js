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
            type: 'POST',
            url: 'test',
            body: {id: 1},
            headers: {
                'content-type': 'application/json'
            },
            success: response => `${response} dispatched from action.success`,
            error: response => `${response} dispatched from action.error`
        }
    }

    it('should ', () => {
        resolve()

        execute(anAction())

        expect(exchange).toHaveBeenCalledWith({
            url: 'test',
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: {id: 1}
        })
    })

    it('', () => {
        const action = anAction()
        delete action.headers

        resolve()

        execute(action)

        expect(exchange).toHaveBeenCalledWith({url: 'test', method: 'POST', headers: {}, body: {id: 1}})
    })

    it('1', () => {
        resolve()

        execute({type: 'OTHER_ACTION'})

        expect(next).toHaveBeenCalledWith({type: 'OTHER_ACTION'})
        expect(exchange).not.toHaveBeenCalled()
        expect(dispatch).not.toHaveBeenCalled()
    })

    it('2', done => {
        resolve('expected success')

        execute(anAction()).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalledWith('expected success dispatched from action.success')
            done()
        })
    })

    it('3', done => {
        reject('expected error')

        execute(anAction()).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).toHaveBeenCalledWith('expected error dispatched from action.error')
            done()
        })
    })

    it('3', done => {
        const action = anAction()
        action.success = 'not a function'

        resolve()

        execute(action).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
            done()
        })
    })

    it('3', done => {
        const action = anAction()
        action.error = 'not a function'

        reject()

        execute(action).then(() => {
            expect(next).not.toHaveBeenCalled()
            expect(dispatch).not.toHaveBeenCalled()
            done()
        })
    })
})
