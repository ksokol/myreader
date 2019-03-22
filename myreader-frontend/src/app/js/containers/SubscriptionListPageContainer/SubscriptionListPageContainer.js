import React from 'react'
import {connect} from 'react-redux'
import {fetchSubscriptions, filteredBySearchSubscriptionsSelector, routeChange, routeSelector} from '../../store'
import {SubscriptionListPage} from '../../pages'
import {subscriptionsRoute} from '../../routes'

const mapStateToProps = state => ({
  ...filteredBySearchSubscriptionsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(fetchSubscriptions()),
  onSearchChange: params => dispatch(routeChange(subscriptionsRoute(params)))
})

const SubscriptionListPageContainer = props => <SubscriptionListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListPageContainer)
