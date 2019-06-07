export {Toast} from './Toast'
import {showErrorNotification, showSuccessNotification} from '../../store'

let dispatch

/**
 * @deprecated
 */
function init(dispatchFn) {
  dispatch = dispatchFn
}

function toast(message, options = {error: false}) {
  if (!dispatch) {
    return
  }

  if (options.error) {
    dispatch(showErrorNotification(message))
  } else {
    dispatch(showSuccessNotification(message))
  }
}

export {
  init,
  toast
}
