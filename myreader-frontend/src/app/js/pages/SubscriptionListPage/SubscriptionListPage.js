import React from 'react'
import {SubscriptionList} from '../../components'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'
import {ListLayout} from '../../components/ListLayout/ListLayout'

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

