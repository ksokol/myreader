import {PROCESSING} from '../../constants'
import {showSuccessNotification} from '../common/index'

export const rebuildSearchIndex = () => {
    return {
        type: 'PUT',
        url: PROCESSING,
        body: {process: 'indexSyncJob'},
        success: () => showSuccessNotification('Indexing started')
    }
}
