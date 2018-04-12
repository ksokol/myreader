import arrayMiddleware from './arrayMiddleware'

describe('src/app/js/store/middleware/array/arrayMiddleware.spec.js', () => {

    let next, dispatch
    let getState = 'expected state fn'

    beforeEach(() => {
        next = jasmine.createSpy('next')
        dispatch = jasmine.createSpy('dispatch')
    })

    const execute = action => arrayMiddleware({dispatch, getState})(next)(action)

    it('should trigger next when action value is single action', () => {
        execute({type: 'AN_ACTION'})
        expect(next).toHaveBeenCalledWith({type: 'AN_ACTION'})
    })

    it('should not trigger next when action value is array of actions', () => {
        execute([])
        expect(next).not.toHaveBeenCalled()
    })

    it('should dispatch each action', () => {
        execute([{type: 'ACTION1'}, {type: 'ACTION2'}])

        expect(dispatch.calls.allArgs()).toEqual([[{type: 'ACTION1'}, 'expected state fn'], [{type: 'ACTION2'}, 'expected state fn']]);
    })
})
