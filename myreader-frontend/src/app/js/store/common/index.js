export {removeNotification, showSuccessNotification, showErrorNotification} from './actions'
export {getNotifications} from './selectors'
export {commonReducers} from './reducers'

export const initialState = () => {
    return {
        notification: {
            nextId: 0,
            notifications: []
        }
    }
}
