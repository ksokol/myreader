import * as types from 'store/action-types'
import initialState from '.'
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
        case types.ENTRY_CHANGED: {
            return entryChanged({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
