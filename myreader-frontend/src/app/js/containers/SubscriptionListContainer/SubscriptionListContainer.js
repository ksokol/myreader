import React from 'react'
import {connect} from 'react-redux'
import {filteredBySearchSubscriptionsSelector, routeChange} from '../../store'
import {SubscriptionList} from '../../components'

const mapStateToProps = filteredBySearchSubscriptionsSelector

const mapDispatchToProps = dispatch => ({
  navigateTo: subscription => dispatch(routeChange(['app', 'subscription'], {uuid: subscription.uuid}))
})

const SubscriptionListContainer = props => <SubscriptionList {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionListContainer)
