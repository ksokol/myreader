import React from 'react'
import {connect} from 'react-redux'
import {mediaBreakpointIsDesktopSelector, sidenavSlideIn, toggleSidenav} from '../../store'
import {SidenavLayout} from '../../components'

const mapStateToProps = state => ({
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  sidenavSlideIn: sidenavSlideIn(state)
})

const mapDispatchToProps = dispatch => ({
  toggleSidenav: () => dispatch(toggleSidenav())
})

const SidenavLayoutContainer = props => <SidenavLayout {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidenavLayoutContainer)
