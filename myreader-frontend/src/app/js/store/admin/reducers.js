import * as types from 'store/action-types'
import {initialApplicationState} from 'store'
import {equalLinks} from '../shared/links'

function applicationInfoReceived({state, action}) {
    return {...state, applicationInfo: action.applicationInfo}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialApplicationState().admin
}

function feedFetchFailuresClear({state}) {
    return {...state, fetchFailures: {}}
}

function feedFetchFailuresReceived({state, action}) {
    const fetchFailures = {failures: action.failures, links: action.links, totalElements: action.totalElements}
    const fetchFailureLinks = state.fetchFailures.links || {}
    if (equalLinks(fetchFailureLinks.self, action.links.self, ['next'])) {
        fetchFailures.failures = [...state.fetchFailures.failures, ...action.failures]
    }
    return {...state, fetchFailures}
}

export function adminReducers(state = initialApplicationState().admin, action) {
    switch (action.type) {
        case types.APPLICATION_INFO_RECEIVED: {
            return applicationInfoReceived({state, action})
        }
        case types.FEED_FETCH_FAILURES_CLEAR: {
            return feedFetchFailuresClear({state, action})
        }
        case types.FEED_FETCH_FAILURES_RECEIVED: {
            return feedFetchFailuresReceived({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
