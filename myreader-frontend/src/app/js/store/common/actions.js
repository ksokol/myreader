import * as types from 'store/action-types'
import {getNextNotificationId} from 'store'

export const fetchStart = () => {
    return {type: types.FETCH_START}
}

export const removeNotification = ({id}) => {
    return {type: types.REMOVE_NOTIFICATION, id}
}

const showNotification = (text, type) => {
    return (dispatch, getState) => {
        const id = getNextNotificationId(getState())
        dispatch({type: types.SHOW_NOTIFICATION, notification: {id, text, type}})
        setTimeout(() => dispatch(removeNotification({id})), 3000)
    }
}

export const showSuccessNotification = text => showNotification(text, 'success')

export const showErrorNotification = text => showNotification(text, 'error')

export const fetchEnd = (errorMessage = null) => {
    return dispatch => {
        if (errorMessage) {
            dispatch(showErrorNotification(errorMessage))
        }
        dispatch({type: types.FETCH_END})
    }
}
