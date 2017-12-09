export {fetchStart, fetchEnd, removeNotification, showSuccessNotification, showErrorNotification} from './actions'
export {getNotifications, getPendingRequests} from './selectors'
export {commonReducers} from './reducers'

export const initialState = () => {
    return {
        pendingRequests: 0,
        notification: {
            nextId: 0,
            notifications: []
        }
    }
}
