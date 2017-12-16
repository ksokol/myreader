import {initialState, commonReducers} from './index'

describe('src/app/js/store/common/reducers.spec.js', () => {

    let state

    beforeEach(() => state = initialState())

    it('initial state', () => {
        const action = {type: 'UNKNOWN_ACTION'}

        expect(commonReducers(state, action)).toEqual(state)
    })

    it('action SHOW_NOTIFICATION', () => {
        const action = {
            type: 'SHOW_NOTIFICATION',
            notification: {id: 0, text: 'notification0'}
        }

        const expectedState = {
            notification: {
                nextId: 1,
                notifications: [
                    {id: 0, text: 'notification0'}
                ]
            }
        }

        expect(commonReducers(state, action)).toContainObject(expectedState)
    })

    it('action REMOVE_NOTIFICATION', () => {
        const action = {
            type: 'REMOVE_NOTIFICATION',
            id: 1
        }

        const currentState = {
            notification: {
                nextId: 3,
                notifications: [
                    {id: 1, text: 'notification1'},
                    {id: 2, text: 'notification2'}
                ]
            }
        }

        const expectedState = {
            notification: {
                nextId: 3,
                notifications: [
                    {id: 2, text: 'notification2'}
                ]
            }
        }

        expect(commonReducers(currentState, action)).toContainObject(expectedState)
    })

    it('action FETCH_START', () => {
        expect(commonReducers(state, {type: 'FETCH_START'})).toContainObject({pendingRequests: 1})
        expect(commonReducers(state, {type: 'FETCH_START'})).toContainObject({pendingRequests: 2})
    })

    it('action FETCH_END', () => {
        commonReducers(state, {type: 'FETCH_START'})
        expect(commonReducers(state, {type: 'FETCH_END'})).toContainObject({pendingRequests: 0})
    })
})