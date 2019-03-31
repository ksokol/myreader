import React from 'react'
import {connect} from 'react-redux'
import {adminPermissionSelector, filteredByUnseenSubscriptionsSelector, toggleSidenav} from '../../store'
import {Navigation} from '../../components'

const mapStateToProps = state => ({
  isAdmin: adminPermissionSelector(state),
  ...filteredByUnseenSubscriptionsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(toggleSidenav())
})

const NavigationContainer = props => <Navigation {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer)
