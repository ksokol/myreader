import './Toast.css'
import React, {useEffect, useReducer, useCallback} from 'react'

const dismissTimeout = 3000

function reducer(state, action) {
  let newState = state

  if (action.type === 'add' && !state.includes(action.notification)) {
    newState = [action.notification, ...state.splice(0, 2)]
  } else if (action.type === 'remove') {
    newState = state.filter(it => it.id !== action.notification.id)
  }

  return newState
}

const ToastItem = ({notification, dispatch}) => {
  const removeNotification = () => dispatch({type: 'remove', notification})
  const savedCallback = React.useRef()
  const callback = useCallback(removeNotification, [dispatch, notification])

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const id = setTimeout(savedCallback.current, dismissTimeout)
    return () => clearTimeout(id)
  }, [callback])

  const typeClass = notification.type === 'error' ? 'my-toast__item--error' : ''
  const role = notification.type === 'error' ? 'dialog-error-message' : 'dialog-info-message'

  return (
    <div
      key={notification.id}
      className={`my-toast__item ${typeClass}`}
      role={role}
      onClick={() => dispatch({type: 'remove', notification})}>
      {notification.text}
    </div>
  )
}

export const Toast = ({notification}) => {
  const [state, dispatch] = useReducer(reducer, [])

  useEffect(() => dispatch({type: 'add', notification}), [notification])

  return state.map(n =>
    <ToastItem
      key={n.id}
      notification={n}
      dispatch={dispatch}
    />
  )
}
