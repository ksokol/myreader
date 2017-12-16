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
            return {...state, entries: [], links: {}}
        }
        case securityTypes.SECURITY_UPDATE: {
            let links = action.authorized ? state.links : {}
            let entries = action.authorized ? state.entries : []
            return {...state, entries, links}
        }
        default: {
            return state
        }
    }
}
