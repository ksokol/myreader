import {useCallback, useEffect, useState} from 'react'
import NavigationContext from './NavigationContext'
import {api} from '../../api'
import {toast} from '../../components/Toast'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

const urlPattern = new RegExp(`[.*/]?${SUBSCRIPTION_ENTRIES}/[a-z0-9\\-].*$`)

export function NavigationProvider({children}) {
  const [state, setState] = useState({
    subscriptions: [],
  })

  const fetchData = useCallback(async () => {
    try {
      const {subscriptions} = await api.get({
        url: 'views/NavigationFragment',
      })

      setState({
        subscriptions,
      })
    } catch (error) {
      toast(error.data, {error: true})
    }
  }, [])

  const entryChanged = useCallback((newEntry, oldEntry) => {
    const updatedSubscriptions = state.subscriptions.map(it => {
      const unseenChanged = it.uuid === newEntry.feedUuid && newEntry.seen !== oldEntry.seen

      return unseenChanged ? {
        ...it,
        unseen: newEntry.seen ? it.unseen - 1 : it.unseen + 1
      } : it
    })

    setState((current) => ({
      ...current,
      subscriptions: updatedSubscriptions,
    }))
  }, [state.subscriptions])

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
    <NavigationContext.Provider
      value={{
        subscriptions: state.subscriptions,
        fetchData,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
