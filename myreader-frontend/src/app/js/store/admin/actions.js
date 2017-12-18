import {PROCESSING} from '../../constants'
import {showSuccessNotification} from 'store'

export const rebuildSearchIndex = () => {
    return {
        type: 'PUT',
        url: PROCESSING,
        body: {process: 'indexSyncJob'},
        success: () => showSuccessNotification('Indexing started')
    }
}
