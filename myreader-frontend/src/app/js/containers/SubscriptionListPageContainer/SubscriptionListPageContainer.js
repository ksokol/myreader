import React from 'react'
import {connect} from 'react-redux'
import {filteredBySearchSubscriptionsSelector} from '../../store'
import {SubscriptionListPage} from '../../pages'

const mapStateToProps = state => ({
  ...filteredBySearchSubscriptionsSelector(state)
})

const SubscriptionListPageContainer = props => <SubscriptionListPage {...props} />

export default connect(
  mapStateToProps
)(SubscriptionListPageContainer)
