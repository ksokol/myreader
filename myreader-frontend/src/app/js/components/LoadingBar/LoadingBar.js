import './LoadingBar.css'
import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {api} from '../../api'

export function LoadingBar() {
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const interceptor = {
      onBefore: () => setPendingCount(prevState => prevState + 1),
      onFinally: () => setPendingCount(prevState => Math.max(prevState - 1, 0))
    }

    api.addInterceptor(interceptor)
    return () => api.removeInterceptor(interceptor)
  }, [])

  return (
    pendingCount > 0 ? ReactDOM.createPortal(
      <div
        role='loading-indicator'
      >
        <div />
      </div>,
      document.querySelector('body')
    ) : null
  )
}
