import * as types from 'store/action-types'
import {FEEDS, INFO, PROCESSING} from 'constants'
import {showErrorNotification, showSuccessNotification} from 'store'
import {toApplicationInfo} from './application-info'
import {toFeed, toFeedFetchFailures} from './feed'
import {toUrlString} from 'store/shared/links'

export const rebuildSearchIndex = () => {
    return {
        type: 'PUT_INDEX_SYNC_JOB',
        url: PROCESSING,
        body: {process: 'indexSyncJob'},
        success: () => showSuccessNotification('Indexing started')
    }
}

export const applicationInfoReceived = raw => {
    return {type: types.APPLICATION_INFO_RECEIVED, applicationInfo: toApplicationInfo(raw)}
}

export const fetchApplicationInfo = () => {
    return {
        type: 'GET_APPLICATION_INFO',
        url: INFO,
        success: response => applicationInfoReceived(response),
        error: () => showErrorNotification('Application info is missing')
    }
}

export const feedReceived = raw => {
    return {type: types.FEED_RECEIVED, feed: toFeed(raw)}
}

export const fetchFeed = uuid => {
    return {
        type: 'GET_FEED',
        url: `${FEEDS}/${uuid}`,
        success: response => feedReceived(response)
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
        success: response => feedFetchFailuresReceived(response)
    }
}
