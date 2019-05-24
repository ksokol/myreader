import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {ListLayout, SubscriptionList} from '../../components'
import {withLocationState} from '../../contexts'
import {filteredBySearchSubscriptionsSelector} from '../../store'

const mapStateToProps = (state, ownProps) => ({
  ...filteredBySearchSubscriptionsSelector(ownProps.searchParams.q)(state)
})

const SubscriptionListPage = props =>
  <ListLayout
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  subscriptions: PropTypes.any.isRequired,
  searchParams: PropTypes.shape({
    q: PropTypes.string
  }).isRequired
}

export default withLocationState(
  connect(
    mapStateToProps
  )(SubscriptionListPage)
)
