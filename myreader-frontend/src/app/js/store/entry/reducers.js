import {initialState} from './index'
import * as types from './action-types'
import * as securityTypes from '../index'
import {equalLinks} from '../shared/links'

export function entryReducers(state = initialState(), action) {
    switch (action.type) {
        case types.ENTRY_PAGE_RECEIVED: {
            const links = action.links
            const entries = equalLinks(state.links.self, links.self, ['next']) ?
                [...state.entries].concat(action.entries) :
                action.entries;
            return {...state, entries, links}
        }
        case types.ENTRY_UPDATED: {
            const entries = state.entries.map(it => it.uuid === action.entry.uuid ? action.entry : it)
            return {...state, entries}
        }
        case types.ENTRY_CLEAR: {
            return {...state, entries: [], links: {}, entryInFocus: null}
        }
        case types.ENTRY_FOCUS_NEXT: {
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
        case types.ENTRY_FOCUS_PREVIOUS: {
            if (!action.currentInFocus) {
                return {...state, entryInFocus: null}
            } else {
                const index = state.entries.findIndex(it => it.uuid === action.currentInFocus)
                const previous = state.entries[index - 1]
                return {...state, entryInFocus: previous ? previous.uuid: null}
            }
        }
        case securityTypes.SECURITY_UPDATE: {
            let links = action.authorized ? state.links : {}
            let entries = action.authorized ? state.entries : []
            let entryInFocus = action.authorized ? state.entryInFocus : null
            return {...state, entries, links, entryInFocus}
        }
        default: {
            return state
        }
    }
}
