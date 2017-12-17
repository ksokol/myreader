import {initialState} from './index'
import * as types from './action-types'
import * as securityTypes from '../index'
import {equalLinks} from '../shared/links'

function entryPageReceived({state, action}) {
    const links = action.links
    const entries = equalLinks(state.links.self, links.self, ['next']) ?
        [...state.entries].concat(action.entries) :
        action.entries;
    return {...state, entries, links}
}

function entryUpdated({state, action}) {
    const entries = state.entries.map(it => it.uuid === action.entry.uuid ? action.entry : it)
    return {...state, entries}
}

function entryClear({state}) {
    return {...state, entries: [], links: {}, entryInFocus: null}
}

function entryFocusNext({state, action}) {
    if (!action.currentInFocus) {
        return {...state, entryInFocus: state.entries[0].uuid}
    } else {
        const index = state.entries.findIndex(it => it.uuid === action.currentInFocus)
        const next = state.entries[index + 1]

        if (next) {
            return {...state, entryInFocus: next.uuid}
        }
    }
    return state
}

function entryFocusPrevious({state, action}) {
    if (!action.currentInFocus) {
        return {...state, entryInFocus: null}
    }
    const index = state.entries.findIndex(it => it.uuid === action.currentInFocus)
    const previous = state.entries[index - 1]
    return {...state, entryInFocus: previous ? previous.uuid: null}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialState()
}

export function entryReducers(state = initialState(), action) {
    switch (action.type) {
        case types.ENTRY_PAGE_RECEIVED: {
            return entryPageReceived({state, action})
        }
        case types.ENTRY_UPDATED: {
            return entryUpdated({state, action})
        }
        case types.ENTRY_CLEAR: {
            return entryClear({state})
        }
        case types.ENTRY_FOCUS_NEXT: {
            return entryFocusNext({state, action})
        }
        case types.ENTRY_FOCUS_PREVIOUS: {
            return entryFocusPrevious({state, action})
        }
        case securityTypes.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
