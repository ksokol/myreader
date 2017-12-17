import * as types from './action-types'
import * as securityTypes from '../index'
import * as entryTypes from '../entry/index'
import {initialState} from './index'
import {cloneObject} from '../shared/objects'

function subscriptionsReceived({state, action}) {
    return {...state, subscriptions: action.subscriptions}
}

function entryChanged({state, action}) {
    const {newValue, oldValue} = action
    const subscriptions = state.subscriptions.map(it => {
        const clone = cloneObject(it)
        if (clone.uuid === newValue.feedUuid && newValue.seen !== oldValue.seen) {
            clone.unseen = newValue.seen ? clone.unseen - 1 : clone.unseen + 1
        }
        return clone
    })
    return {...state, subscriptions}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialState()
}

export function subscriptionReducers(state = initialState(), action) {
    switch (action.type) {
        case types.SUBSCRIPTIONS_RECEIVED: {
            return subscriptionsReceived({state, action})
        }
        case entryTypes.ENTRY_CHANGED: {
            return entryChanged({state, action})
        }
        case securityTypes.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
