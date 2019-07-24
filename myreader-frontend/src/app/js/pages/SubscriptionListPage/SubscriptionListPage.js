import React from 'react'
import {ListLayout, SubscriptionList} from '../../components'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'

export const SubscriptionListPage = () => {
  return (
    <SubscriptionContext.Consumer>
      {({subscriptions}) => (
        <ListLayout
          listPanel={<SubscriptionList subscriptions={subscriptions} />}
        />
      )}
    </SubscriptionContext.Consumer>
  )
}

