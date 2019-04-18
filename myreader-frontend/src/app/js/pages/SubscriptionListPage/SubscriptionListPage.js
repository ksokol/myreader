import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {ListLayout, SubscriptionList} from '../../components'
import {filteredBySearchSubscriptionsSelector} from '../../store'
import {toQueryObject} from '../../shared/location-utils'

const mapStateToProps = (state, ownProps) => ({
  ...filteredBySearchSubscriptionsSelector(toQueryObject(ownProps.location).q)(state)
})

const SubscriptionListPage = props =>
  <ListLayout
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  subscriptions: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(
  connect(
    mapStateToProps
  )(SubscriptionListPage)
)
