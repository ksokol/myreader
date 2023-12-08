import React, {useState, useRef, useEffect} from 'react'
import ReactDom from 'react-dom'

export function Backdrop(props) {
  const timeout = useRef()
  const [state, setState] = useState({
    isVisible: false,
    isClosing: false,
    isMounted: false
  })

  const scheduleUnmount = () => {
    timeout.current = setTimeout(() => {
      setState({
        isVisible: false,
        isClosing: false,
        isMounted: false
      })
    }, 300)
  }

  useEffect(() => {
    if (state.isVisible === props.maybeVisible) {
      return
    }
    clearTimeout(timeout.current)

    if (state.isVisible) {
      scheduleUnmount()
      setState({
        isVisible: props.maybeVisible,
        isClosing: true,
        isMounted: true
      })
    } else {
      setState({
        isVisible: true,
        isClosing: false,
        isMounted: true
      })
    }
  }, [props.maybeVisible, state.isVisible])

  useEffect(() => {
    return () => clearTimeout(timeout.current)
  }, [])

  const classes = [
    'my-backdrop',
    state.isVisible ? 'my-backdrop--visible': '',
    state.isClosing ? 'my-backdrop--closing': ''
  ]

  return state.isMounted ? (
    ReactDom.createPortal(
      <div
        className={classes.join(' ')}
        role='backdrop'
        onClick={props.onClick}
      />,
      document.body
    )
  ) : null
}
