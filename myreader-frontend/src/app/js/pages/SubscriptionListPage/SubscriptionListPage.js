import React from 'react'
import PropTypes from 'prop-types'
import {ListLayout, SubscriptionList} from '../../components'

const SubscriptionListPage = props =>
  <ListLayout
    onSearchChange={props.onSearchChange}
    onRefresh={props.onRefresh}
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  subscriptions: PropTypes.any.isRequired
}

export default SubscriptionListPage
