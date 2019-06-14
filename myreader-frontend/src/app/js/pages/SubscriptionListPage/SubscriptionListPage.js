import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {ListLayout, SubscriptionList} from '../../components'
import {subscriptionsSelector} from '../../store'

const mapStateToProps = subscriptionsSelector

const SubscriptionListPage = props =>
  <ListLayout
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  subscriptions: PropTypes.any.isRequired
}

export default connect(
  mapStateToProps
)(SubscriptionListPage)
