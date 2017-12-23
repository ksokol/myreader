import initialState from '.'
import * as types from 'store/action-types'
import {equalLinks} from '../shared/links'

function entryPageReceived({state, action}) {
    const links = action.links
    let actionEntries = [...action.entries]
    let entries = actionEntries

    if (equalLinks(state.links.self, links.self, ['next'])) {
        entries = []
        state.entries.forEach(stateEntry => {
            let index = actionEntries.findIndex(actionEntry => stateEntry.uuid === actionEntry.uuid)
            entries.push(index === -1 ? stateEntry : actionEntries.splice(index, 1)[0])
        })

        entries = entries.concat(actionEntries)
    }

    return {...state, entries, links}
}

function entryChanged({state, action}) {
    const entries = state.entries.map(it => it.uuid === action.newValue.uuid ? action.newValue : it)
    let tags = state.tags
    const entryTags = (action.newValue.tag || '')
        .split(',')
        .map(it => it.trim())
        .filter(it => it.length > 0)
        .filter(it => !tags.includes(it))

    tags = [...tags, ...entryTags].sort()
    return {...state, entries, tags}
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

function entryTagsReceived({state, action}) {
    return {...state, tags: action.tags}
}

function securityUpdate({state, action}) {
    return action.authorized ? state : initialState()
}

export function entryReducers(state = initialState(), action) {
    switch (action.type) {
        case types.ENTRY_PAGE_RECEIVED: {
            return entryPageReceived({state, action})
        }
        case types.ENTRY_CHANGED: {
            return entryChanged({state, action})
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
        case types.ENTRY_TAGS_RECEIVED: {
            return entryTagsReceived({state, action})
        }
        case types.SECURITY_UPDATE: {
            return securityUpdate({state, action})
        }
        default: {
            return state
        }
    }
}
