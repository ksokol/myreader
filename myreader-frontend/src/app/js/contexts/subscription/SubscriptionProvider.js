import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SubscriptionContext from './SubscriptionContext'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {SubscriptionProviderInterceptor} from './SubscriptionProviderInterceptor'

export function SubscriptionProvider({children}) {
  const [subscriptions, setSubscriptions] = useState([])

  const fetchSubscriptions = useCallback(async () => {
    try {
      setSubscriptions(await subscriptionApi.fetchSubscriptions())
    } catch (error) {
      toast(error.data, {error: true})
    }
  }, [])

  const entryChanged = useCallback((newEntry, oldEntry) => {
    const updatedSubscriptions = subscriptions.map(it => {
      const unseenChanged = it.uuid === newEntry.feedUuid && newEntry.seen !== oldEntry.seen

      return unseenChanged ? {
        ...it,
        unseen: newEntry.seen ? it.unseen - 1 : it.unseen + 1
      } : it
    })

    setSubscriptions(updatedSubscriptions)
  }, [subscriptions])

  useEffect(() => {
    const interceptor = new SubscriptionProviderInterceptor((newEntry, oldEntry) => entryChanged(newEntry, oldEntry))

    subscriptionApi.addInterceptor(interceptor)
    return () => subscriptionApi.removeInterceptor(interceptor)
  }, [entryChanged])

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        fetchSubscriptions
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

SubscriptionProvider.propTypes = {
  children: PropTypes.any
}
