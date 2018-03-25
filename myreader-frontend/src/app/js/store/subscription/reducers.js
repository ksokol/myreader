import * as types from 'store/action-types'
import {cloneObject} from '../shared/objects'
import {initialApplicationState} from 'store'
import {byPattern} from './subscription'

function subscriptionsReceived({state, action}) {
    return {...state, subscriptions: action.subscriptions}
}

function subscriptionChanged({state, action}) {
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

function subscriptionTagsReceived({state, action}) {
    return {...state, tags: {loaded: true, items: action.tags}}
}

function subscriptionExclusionPatternsReceived({state, action}) {
    const exclusions = {...state.exclusions}
    exclusions[action.subscriptionUuid] = action.patterns
    return {...state, exclusions}
}

function subscriptionExclusionPatternsAdded({state, action}) {
    const exclusions = {...state.exclusions}
    let exclusion = exclusions[action.subscriptionUuid] || []

    exclusion = exclusion.findIndex(it => it.uuid === action.pattern.uuid) !== -1 ?
        exclusion.map(it => (it.uuid === action.pattern.uuid ? action.pattern : it)) :
        [...exclusion, action.pattern]

    exclusions[action.subscriptionUuid] = exclusion.sort(byPattern)

    return {...state, exclusions}
}

function subscriptionExclusionPatternsRemoved({state, action}) {
    let exclusion = state.exclusions[action.subscriptionUuid]

    if (!exclusion) {
        return state
    }

    let exclusions = {...state.exclusions}
    exclusions[action.subscriptionUuid] = exclusion.filter(it => it.uuid !== action.uuid)
    return {...state, exclusions}
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
            return subscriptionChanged({state, action})
        }
        case types.SUBSCRIPTION_DELETED: {
            return subscriptionDeleted({state, action})
        }
        case types.SUBSCRIPTION_SAVED: {
            return subscriptionSaved({state, action})
        }
        case types.SUBSCRIPTION_TAGS_RECEIVED: {
            return subscriptionTagsReceived({state, action})
        }
        case types.SUBSCRIPTION_EXCLUSION_PATTERNS_RECEIVED: {
            return subscriptionExclusionPatternsReceived({state, action})
        }
        case types.SUBSCRIPTION_EXCLUSION_PATTERNS_ADDED: {
            return subscriptionExclusionPatternsAdded({state, action})
        }
        case types.SUBSCRIPTION_EXCLUSION_PATTERNS_REMOVED: {
            return subscriptionExclusionPatternsRemoved({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
