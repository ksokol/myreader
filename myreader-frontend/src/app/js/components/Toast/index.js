export {Toast} from './Toast'
import {showErrorNotification, showSuccessNotification} from '../../store'

let dispatch

/**
 * @deprecated
 */
function init(dispatchFn) {
  dispatch = dispatchFn
}

function toast(message = 'something went wrong', options = {error: false}) {
  if (!dispatch) {
    return
  }

  const messageString = typeof message === 'string' ? message : message.toString()

  if (options.error) {
    dispatch(showErrorNotification(messageString))
  } else {
    dispatch(showSuccessNotification(messageString))
  }
}

export {
  init,
  toast
}
