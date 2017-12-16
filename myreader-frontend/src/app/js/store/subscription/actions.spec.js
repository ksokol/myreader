import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {initialState} from './index'
import {subscriptionsReceived} from './actions'

describe('src/app/js/store/subscription/actions.spec.js', () => {

    let store, mockStore

    beforeEach(() => {
        mockStore = configureMockStore([thunk])
        store = mockStore({subscription: initialState()})
    })

    describe('SUBSCRIPTIONS_RECEIVED', () => {

        it('should contain expected action type', () => {
            store.dispatch(subscriptionsReceived())
            expect(store.getActions()[0]).toEqualActionType('SUBSCRIPTIONS_RECEIVED')
        })

        it('should return valid object when input is undefined', () => {
            store.dispatch(subscriptionsReceived())
            expect(store.getActions()[0]).toContainActionData({subscriptions: []})
        })

        it('should return expected action data', () => {
            store.dispatch(subscriptionsReceived({content: [{key: 'value1'}, {key: 'value2'}]}))
            expect(store.getActions()[0]).toContainActionData({subscriptions: [{key: 'value1'}, {key: 'value2'}]})
        })
    })
})
