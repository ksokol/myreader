import guardMiddleware from './guardMiddleware'

describe('src/app/js/store/middleware/guard/guardMiddleware.spec.js', () => {

    let next

    beforeEach(() => {
        next = jasmine.createSpy('next')
    })

    const execute = action => guardMiddleware()(next)(action)

    it('should not trigger next when action is undefined', () => {
        execute()
        expect(next).not.toHaveBeenCalled()
    })

    it('should not trigger next when action is null', () => {
        execute(null)
        expect(next).not.toHaveBeenCalled()
    })

    it('should not trigger next when action is an empty object', () => {
        execute({})
        expect(next).not.toHaveBeenCalled()
    })

    it('should not trigger next when action type is null', () => {
        execute({type: null})
        expect(next).not.toHaveBeenCalled()
    })

    it('should not trigger next when action type is not of type string', () => {
        execute({type: 1})
        expect(next).not.toHaveBeenCalled()
    })

    it('should trigger next when action type is of type string', () => {
        execute({type: 'AN_ACTION'})
        expect(next).toHaveBeenCalledWith({type: 'AN_ACTION'})
    })
})
