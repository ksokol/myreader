import * as types from '../../store/action-types'
import {FEEDS, INFO} from '../../constants'
import {showErrorNotification} from '../../store'
import {toApplicationInfo} from './application-info'
import {toFeedFetchFailures, toFeeds} from './feed'
import {toUrlString} from '../../store/shared/links'

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

export const fetchFeed = ({uuid, success}) => {
  return {
    type: 'GET_FEED',
    url: `${FEEDS}/${uuid}`,
    success
  }
}

export const saveFeed = ({feed, success, error, finalize}) => {
  return {
    type: 'PATCH_FEED',
    url: `${FEEDS}/${feed.uuid}`,
    body: feed,
    success,
    error,
    finalize
  }
}

export const feedDeleted = uuid => {
  return {
    type: types.FEED_DELETED,
    uuid
  }
}

export const deleteFeed = ({uuid, success, error}) => {
  return {
    type: 'DELETE_FEED',
    url: `${FEEDS}/${uuid}`,
    success,
    error
  }
}
