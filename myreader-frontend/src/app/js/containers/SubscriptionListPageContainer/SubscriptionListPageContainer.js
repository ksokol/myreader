import React from 'react'
import {connect} from 'react-redux'
import {fetchSubscriptions, filteredBySearchSubscriptionsSelector, routeChange, routeSelector} from '../../store'
import {SubscriptionListPage} from '../../components'

const mapStateToProps = state => ({
  ...filteredBySearchSubscriptionsSelector(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  navigateTo: subscription => dispatch(routeChange(['app', 'subscription'], {uuid: subscription.uuid})),
  onRefresh: () => dispatch(fetchSubscriptions()),
  onSearchChange: params => dispatch(routeChange(['app', 'subscriptions'], {...params}))
})

const SubscriptionListPageContainer = props => <SubscriptionListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListPageContainer)
