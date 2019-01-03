import * as types from '../../store/action-types'
import {FEEDS, INFO, PROCESSING} from '../../constants'
import {routeChange, showErrorNotification, showSuccessNotification} from '../../store'
import {toApplicationInfo} from './application-info'
import {toFeed, toFeedFetchFailures, toFeeds} from './feed'
import {toUrlString} from '../../store/shared/links'

export const rebuildSearchIndex = () => {
  return {
    type: 'PUT_INDEX_SYNC_JOB',
    url: PROCESSING,
    body: {process: 'indexSyncJob'},
    success: () => showSuccessNotification('Indexing started')
  }
}

export const applicationInfoReceived = raw => {
  return {
    type: types.APPLICATION_INFO_RECEIVED,
    applicationInfo: toApplicationInfo(raw)
  }
}

export const fetchApplicationInfo = () => {
  return {
    type: 'GET_APPLICATION_INFO',
    url: INFO,
    success: response => applicationInfoReceived(response),
    error: () => showErrorNotification('Application info is missing')
  }
}

export const feedsReceived = raw => {
  return {
    type: types.FEEDS_RECEIVED,
    ...toFeeds(raw)
  }
}

export const fetchFeeds = () => {
  return {
    type: 'GET_FEEDS',
    url: FEEDS,
    success: response => feedsReceived(response)
  }
}

export const feedFetchFailuresClear = () => {
  return {type: types.FEED_FETCH_FAILURES_CLEAR}
}

export const feedFetchFailuresReceived = raw => {
  return {type: types.FEED_FETCH_FAILURES_RECEIVED, ...toFeedFetchFailures(raw)}
}

export const fetchFeedFetchFailures = link => {
  return {
    type: 'GET_FEED_FETCH_FAILURES',
    url: toUrlString(link),
    before: () => ({type: types.FEED_FETCH_FAILURES_LOADING}),
    success: response => feedFetchFailuresReceived(response),
    finalize: () => ({type: types.FEED_FETCH_FAILURES_LOADED})
  }
}

export const clearFeedEditForm = () => {
  return {
    type: types.FEED_EDIT_FORM_CLEAR
  }
}

const loadFeedEditForm = feed => {
  return {
    type: types.FEED_EDIT_FORM_LOAD,
    feed
  }
}

export const loadFeedIntoEditForm = uuid => {
  return {
    type: 'GET_FEED',
    url: `${FEEDS}/${uuid}`,
    success: response => loadFeedEditForm(toFeed(response))
  }
}

export const feedEditFormChangeData = data => {
  return {
    type: types.FEED_EDIT_FORM_CHANGE_DATA,
    data
  }
}

const feedEditFormChanging = () => {
  return {
    type: types.FEED_EDIT_FORM_CHANGING
  }
}

const feedEditFormChanged = () => {
  return {
    type: types.FEED_EDIT_FORM_CHANGED
  }
}

const feedEditFormValidations = validations => {
  return {
    type: types.FEED_EDIT_FORM_VALIDATIONS,
    validations
  }
}

export const feedEditFormSaved = raw => {
  return {
    type: types.FEED_EDIT_FORM_SAVED,
    data: toFeed(raw)
  }
}

export const saveFeedEditForm = feed => {
  return {
    type: 'PATCH_FEED',
    url: `${FEEDS}/${feed.uuid}`,
    body: feed,
    before: [
      feedEditFormChanging,
      () => feedEditFormValidations([])
    ],
    success: [
      () => showSuccessNotification('Feed saved'),
      response => feedEditFormSaved(response)
    ],
    error: error => {
      if (error.status === 400) {
        return feedEditFormValidations(error.fieldErrors)
      }
    },
    finalize: feedEditFormChanged
  }
}

export const feedDeleted = uuid => {
  return {
    type: types.FEED_DELETED,
    uuid
  }
}

export const deleteFeed = uuid => {
  return {
    type: 'DELETE_FEED',
    url: `${FEEDS}/${uuid}`,
    before: feedEditFormChanging,
    success: [
      () => routeChange(['admin', 'feed']),
      () => feedDeleted(uuid)
    ],
    error: (response, headers, status) =>
      (status === 409 && showErrorNotification('Can not delete. Feed has subscriptions')) ||
      (status !== 400 && showErrorNotification(response)) ||
      undefined,
    finalize: feedEditFormChanged
  }
}
