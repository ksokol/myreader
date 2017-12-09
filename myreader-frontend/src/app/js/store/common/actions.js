import * as types from './action-types'
import {getNextNotificationId} from './selectors'

export const fetchStart = () => {
    return {type: types.FETCH_START}
}

export const fetchEnd = (errorMessage = null) => {
    return dispatch => {
        if (errorMessage) {
            dispatch(showErrorNotification(errorMessage))
        }
        dispatch({type: types.FETCH_END})
    }
}

const showNotification = (text, type) => {
    return (dispatch, getState) => {
        const id = getNextNotificationId(getState)
        dispatch({type: types.SHOW_NOTIFICATION, notification: {id, text, type}})
        setTimeout(() => dispatch(removeNotification({id})), 3000)
    }
}

export const removeNotification = ({id}) => {
    return {type: types.REMOVE_NOTIFICATION, id}
}

export const showSuccessNotification = text => showNotification(text, 'success')

export const showErrorNotification = text => showNotification(text, 'error')
