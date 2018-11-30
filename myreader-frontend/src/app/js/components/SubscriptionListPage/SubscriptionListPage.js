import React from 'react'
import PropTypes from 'prop-types'
import {ListPage, SubscriptionList} from '../../components'

const SubscriptionListPage = props =>
  <ListPage router={props.router}
            onSearchChange={props.onSearchChange}
            onRefresh={props.onRefresh}
            listPanel={<SubscriptionList subscriptions={props.subscriptions}
                                         navigateTo={props.navigateTo} />} />

SubscriptionListPage.propTypes = {
  router: PropTypes.any.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  subscriptions: PropTypes.any.isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default SubscriptionListPage
