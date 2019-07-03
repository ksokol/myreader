import * as types from '../../store/action-types'
import {equalLinks} from '../../api/links'
import {initialApplicationState} from '../../store'

function entryPageLoading({state}) {
  return {...state, loading: true}
}

function entryPageLoaded({state}) {
  return {...state, loading: false}
}

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
  return {...state, entries}
}

function entryClear({state}) {
  return {...state, entries: [], links: {}, entryInFocus: null}
}

function securityUpdate({state, action}) {
  return action.authorized ? state : initialApplicationState().entry
}

export function entryReducers(state = initialApplicationState().entry, action) {
  switch (action.type) {
    case types.ENTRY_PAGE_LOADING: {
      return entryPageLoading({state})
    }
    case types.ENTRY_PAGE_LOADED: {
      return entryPageLoaded({state})
    }
    case types.ENTRY_PAGE_RECEIVED: {
      return entryPageReceived({state, action})
    }
    case types.ENTRY_CHANGED: {
      return entryChanged({state, action})
    }
    case types.ENTRY_CLEAR: {
      return entryClear({state})
    }
    case types.SECURITY_UPDATE: {
      return securityUpdate({state, action})
    }
    default: {
      return state
    }
  }
}
