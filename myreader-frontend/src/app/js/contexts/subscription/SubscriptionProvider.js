import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import SubscriptionContext from './SubscriptionContext'
import {api} from '../../api'
import {toast} from '../../components/Toast'
import {SUBSCRIPTION_ENTRIES, SUBSCRIPTIONS} from '../../constants'

const urlPattern = new RegExp(`[.*/]?${SUBSCRIPTION_ENTRIES}/[a-z0-9\\-].*$`)

export function SubscriptionProvider({children}) {
  const [subscriptions, setSubscriptions] = useState([])

  const fetchSubscriptions = useCallback(async () => {
    try {
      setSubscriptions(await api.get({
        url: SUBSCRIPTIONS,
      }).then(response => response.content))
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
    const interceptor = {
      onThen: (request, response) => {
        if (request.method === 'PATCH' && urlPattern.test(request.url)) {
          entryChanged(response, request.context.oldValue)
        }
      }
    }

    api.addInterceptor(interceptor)
    return () => api.removeInterceptor(interceptor)

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
