import * as types from 'store/action-types'
import {initialApplicationState} from 'store'
import {equalLinks} from 'store/shared/links'

function applicationInfoReceived({state, action}) {
    return {...state, applicationInfo: action.applicationInfo}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialApplicationState().admin
}

function feedFetchFailuresClear({state}) {
    return {...state, fetchFailures: {}}
}

function feedClear({state}) {
    return {...state, selectedFeed: {}}
}

function feedDeleted({state, action}) {
    const feeds = state.feeds.filter(it => it.uuid !== action.uuid)
    return {...state, feeds}
}

function feedsReceived({state, action}) {
    return {...state, feeds: action.feeds}
}

function feedReceived({state, action}) {
    const feeds = state.feeds.map(it => it.uuid === action.feed.uuid ? action.feed : it)
    return {...state, feeds, selectedFeed: {...action.feed}}
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
        case types.FEEDS_RECEIVED: {
            return feedsReceived({state, action})
        }
        case types.FEED_RECEIVED: {
            return feedReceived({state, action})
        }
        case types.FEED_CLEAR: {
            return feedClear({state, action})
        }
        case types.FEED_DELETED: {
            return feedDeleted({state, action})
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
