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

export const feedClear = () => {
    return {type: types.FEED_CLEAR}
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

export const changeFeed = feed => {
    return {
        type: 'PATCH_FEED',
        url: `${FEEDS}/${feed.uuid}`,
        body: {title: feed.title, url: feed.url},
        success: [
            response => feedReceived(response),
            () => showSuccessNotification('Feed saved')
        ]
    }
}

export const feedDeleted = uuid => {
    return {type: 'FEED_DELETED', uuid}
}

export const deleteFeed = uuid => {
    return {
        type: 'DELETE_FEED',
        url: `${FEEDS}/${uuid}`,
        success: () => feedDeleted(uuid),
        error: (response, headers, status) =>
            (status === 409 && showErrorNotification('Can not delete. Feed has subscriptions')) ||
            (status !== 400 && showErrorNotification(response)) ||
            undefined
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
