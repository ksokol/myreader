import React from 'react'
import {connect} from 'react-redux'
import {backdropIsVisible, hideBackdrop} from '../../store'
import {Backdrop} from '../../components'

const mapStateToProps = state => ({
  isBackdropVisible: backdropIsVisible(state)
})

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(hideBackdrop())
})

const BackdropContainer = props => <Backdrop {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackdropContainer)
