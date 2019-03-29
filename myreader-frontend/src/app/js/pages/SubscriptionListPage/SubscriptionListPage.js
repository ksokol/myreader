import React from 'react'
import PropTypes from 'prop-types'
import {ListLayout, SubscriptionList} from '../../components'

const SubscriptionListPage = props =>
  <ListLayout
    listPanel={<SubscriptionList subscriptions={props.subscriptions} />}
  />

SubscriptionListPage.propTypes = {
  subscriptions: PropTypes.any.isRequired
}

export default SubscriptionListPage
