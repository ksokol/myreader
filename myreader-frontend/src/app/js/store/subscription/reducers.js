import * as types from './action-types'
import * as securityTypes from '../index'
import {initialState} from './index'

export function subscriptionReducers(state = initialState(), action) {
    switch (action.type) {
        case types.SUBSCRIPTIONS_RECEIVED: {
            return {...state, subscriptions: action.subscriptions}
        }
        case securityTypes.SECURITY_UPDATE: {
            return action.authorized ? state : initialState()
        }
        default: {
            return state
        }
    }
}
