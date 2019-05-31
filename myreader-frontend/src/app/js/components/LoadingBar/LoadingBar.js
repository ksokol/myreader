import './LoadingBar.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {pendingRequestCountSelector} from '../../store'

const mapStateToProps = state => ({
  pendingCount: pendingRequestCountSelector(state)
})

const LoadingBar = ({pendingCount}) => (
  pendingCount > 0 ? ReactDOM.createPortal(
    <div className='my-loading-bar'>
      <div className='my-loading-bar__indeterminate' />
    </div>,
    document.querySelector('body')
  ) : null
)

export default connect(
  mapStateToProps
)(LoadingBar)
