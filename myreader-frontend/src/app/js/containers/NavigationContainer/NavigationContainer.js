import React from 'react'
import {connect} from 'react-redux'
import {
  adminPermissionSelector,
  filteredByUnseenSubscriptionsSelector,
  routeChange,
  routeSelector,
  toggleSidenav
} from '../../store'
import {Navigation} from '../../components'

const mapStateToProps = state => ({
  isAdmin: adminPermissionSelector(state),
  ...filteredByUnseenSubscriptionsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  routeTo: (route, query) => {
    dispatch(toggleSidenav())
    dispatch(routeChange(route, query))
  }
})

const NavigationContainer = props => <Navigation {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationContainer)
