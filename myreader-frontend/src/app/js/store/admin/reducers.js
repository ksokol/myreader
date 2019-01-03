import * as types from '../../store/action-types'
import {initialApplicationState} from '../../store'

function applicationInfoReceived({state, action}) {
  return {
    ...state,
    applicationInfo: action.applicationInfo
  }
}

function securityUpdate({state, action}) {
  return action.authorized ? state : initialApplicationState().admin
}

function feedFetchFailuresClear({state}) {
  return {
    ...state,
    fetchFailures: {failures: []}
  }
}

function feedDeleted({state, action}) {
  const feeds = state.feeds.filter(it => it.uuid !== action.uuid)
  return {
    ...state,
    feeds
  }
}

function feedReceived({state, action}) {
  const feeds = state.feeds.map(it => it.uuid === action.data.uuid ? action.data : it)
  return {
    ...state,
    feeds
  }
}

function feedsReceived({state, action}) {
  return {
    ...state,
    feeds: action.feeds
  }
}

function feedFetchFailuresLoading({state}) {
  return {
    ...state,
    fetchFailuresLoading: true
  }
}

function feedFetchFailuresLoaded({state}) {
  return {
    ...state,
    fetchFailuresLoading: false
  }
}

function feedFetchFailuresReceived({state, action}) {
  const fetchFailures = {failures: [...state.fetchFailures.failures, ...action.failures], links: action.links}
  return {
    ...state,
    fetchFailures
  }
}

function feedEditFormClear({state}) {
  return {
    ...state,
    editForm: {
      changePending: false,
      data: null,
      validations: []
    }
  }
}

function feedEditFormLoad({state, action}) {
  return {
    ...state,
    editForm: {
      changePending: false,
      data: action.feed,
      validations: state.editForm.validations
    }
  }
}

function feedEditFormChangeData({state, action}) {
  return {
    ...state,
    editForm: {
      ...state.editForm,
      data: action.data
    }
  }
}

function feedEditFormChanging({state}) {
  return {
    ...state,
    editForm: {
      ...state.editForm,
      changePending: true
    }
  }
}

function feedEditFormChanged({state}) {
  return {
    ...state,
    editForm: {
      ...state.editForm,
      changePending: false
    }
  }
}

function feedEditFormSaved({state, action}) {
  return {
    ...state,
    editForm: {
      ...state.editForm,
      data: action.data
    }
  }
}

function feedEditFormValidations({state, action}) {
  return {
    ...state,
    editForm: {
      ...state.editForm,
      validations: action.validations
    }
  }
}

export function adminReducers(state = initialApplicationState().admin, action) {
  switch (action.type) {
  case types.APPLICATION_INFO_RECEIVED: {
    return applicationInfoReceived({state, action})
  }
  case types.FEEDS_RECEIVED: {
    return feedsReceived({state, action})
  }
  case types.FEED_DELETED: {
    return feedDeleted({state, action})
  }
  case types.FEED_FETCH_FAILURES_CLEAR: {
    return feedFetchFailuresClear({state, action})
  }
  case types.FEED_FETCH_FAILURES_LOADING: {
    return feedFetchFailuresLoading({state, action})
  }
  case types.FEED_FETCH_FAILURES_LOADED: {
    return feedFetchFailuresLoaded({state, action})
  }
  case types.FEED_FETCH_FAILURES_RECEIVED: {
    return feedFetchFailuresReceived({state, action})
  }
  case types.FEED_EDIT_FORM_CLEAR: {
    return feedEditFormClear({state, action})
  }
  case types.FEED_EDIT_FORM_LOAD: {
    return feedEditFormLoad({state, action})
  }
  case types.FEED_EDIT_FORM_CHANGE_DATA: {
    return feedEditFormChangeData({state, action})
  }
  case types.FEED_EDIT_FORM_CHANGING: {
    return feedEditFormChanging({state, action})
  }
  case types.FEED_EDIT_FORM_CHANGED: {
    return feedEditFormChanged({state, action})
  }
  case types.FEED_EDIT_FORM_VALIDATIONS: {
    return feedEditFormValidations({state, action})
  }
  case types.FEED_EDIT_FORM_SAVED: {
    const newState = feedReceived({state, action})
    return feedEditFormSaved({state: newState, action})
  }
  case types.SECURITY_UPDATE: {
    return securityUpdate({state, action})
  }
  default: {
    return state
  }
  }
}
