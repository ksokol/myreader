import './LoadingBar.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {api} from '../../api'

export class LoadingBar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      pendingCount: 0
    }
  }

  componentDidMount() {

    api.addInterceptor(this)
  }

  componentWillUnmount() {
    api.removeInterceptor(this)
  }

  onBefore = () => {
    this.setState(prevState => ({
      pendingCount: prevState.pendingCount + 1
    }))
  }

  onFinally = () => {
    this.setState(prevState => ({
      pendingCount: prevState.pendingCount > 0 ? prevState.pendingCount - 1 : 0
    }))
  }

  render() {
    return (
      this.state.pendingCount > 0 ? ReactDOM.createPortal(
        <div className='my-loading-bar'>
          <div className='my-loading-bar__indeterminate' />
        </div>,
        document.querySelector('body')
      ) : null
    )
  }
}
