import * as types from 'store/action-types'
import {cloneObject} from '../shared/objects'
import {initialApplicationState} from 'store'

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

function subscriptionDeleted({state, action}) {
    const subscriptions = state.subscriptions.filter(it => it !== action.uuid)
    return {...state, subscriptions}
}

function subscriptionSaved({state, action}) {
    let subscriptions = !state.subscriptions.some(it => it.uuid === action.subscription.uuid) ?
                            [...state.subscriptions, action.subscription] :
                            state.subscriptions.map(it => it.uuid === action.subscription.uuid ? action.subscription : it)
    return {...state, subscriptions}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialApplicationState().subscription
}

export function subscriptionReducers(state = initialApplicationState().subscription, action) {
    switch (action.type) {
        case types.SUBSCRIPTIONS_RECEIVED: {
            return subscriptionsReceived({state, action})
        }
        case types.ENTRY_CHANGED: {
            return entryChanged({state, action})
        }
        case types.SUBSCRIPTION_DELETED: {
            return subscriptionDeleted({state, action})
        }
        case types.SUBSCRIPTION_SAVED: {
            return subscriptionSaved({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
