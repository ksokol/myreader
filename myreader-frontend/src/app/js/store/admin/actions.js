import * as types from 'store/action-types'
import {INFO, PROCESSING} from '../../constants'
import {showSuccessNotification, showErrorNotification} from 'store'
import {toApplicationInfo} from './application-info'

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
