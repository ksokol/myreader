import React from 'react'
import {connect} from 'react-redux'
import {fetchSubscriptions, filteredBySearchSubscriptionsSelector} from '../../store'
import {SubscriptionListPage} from '../../pages'

const mapStateToProps = state => ({
  ...filteredBySearchSubscriptionsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefresh: () => dispatch(fetchSubscriptions())
})

const SubscriptionListPageContainer = props => <SubscriptionListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListPageContainer)
