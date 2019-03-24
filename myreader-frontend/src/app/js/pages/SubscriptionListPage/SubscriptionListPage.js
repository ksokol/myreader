import React from 'react'
import PropTypes from 'prop-types'
import {ListLayout, SubscriptionList} from '../../components'

const SubscriptionListPage = props =>
  <ListLayout
    onRefresh={props.onRefresh}
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  subscriptions: PropTypes.any.isRequired
}

export default SubscriptionListPage
