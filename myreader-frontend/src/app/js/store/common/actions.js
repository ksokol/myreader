import * as types from './action-types';
import {getNextNotificationId} from './selectors';

const showNotification = (text, type) => {
    return (dispatch, getState) => {
        const id = getNextNotificationId(getState);
        dispatch({type: types.SHOW_NOTIFICATION, notification: {id, text, type}});
        setTimeout(() => dispatch(removeNotification({id})), 3000);
    }
};

export const removeNotification = ({id}) => {
    return {
        type: types.REMOVE_NOTIFICATION, id
    }
};

export const showSuccessNotification = text => {
    return showNotification(text, 'success');
};

export const showErrorNotification = text => {
    return showNotification(text, 'error');
};
