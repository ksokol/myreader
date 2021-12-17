import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'

export const hashPrefix = '#!'

export const RouterContext = React.createContext(null)

export function useRouter() {
  return useContext(RouterContext)
}

export function RouterProvider({children}) {
  const [routerState, setRouterState] = useState({init: true})

  useEffect(() => {
    setRouterState(getCurrentRoute())

    const listener = () => setRouterState(getCurrentRoute())
    window.addEventListener('popstate', listener)

    return () => window.removeEventListener('popstate', listener)  }, [])

  const replaceRoute = useCallback(({pathname = '', search = ''}) => {
    if (pathname !== routerState.pathname || search !== routerState.search) {
      let url = hashPrefix + pathname

      if (search.length > 0) {
        url += `?${search}`
      }

      history.replaceState(null, null, url)
      setRouterState({pathname, search})
    }
  }, [routerState])

  const goBack = useCallback(() => {
    history.back()
  }, [])

  const route = useMemo(() => ({
    pathname: routerState.pathname,
    search: routerState.search,
    searchParams: toSearchParams(routerState.search),
  }), [routerState])

  return !routerState.init ? (
    <RouterContext.Provider
      value={
        {route, replaceRoute, goBack, hashPrefix}
      }
    >
      {children}
    </RouterContext.Provider>
  ) : null
}

RouterProvider.propTypes = {
  children: PropTypes.any
}

function getCurrentRoute() {
  const split = document.location.hash.replace(hashPrefix, '').split('?')

  return {
    pathname: split[0],
    search: split[1] || ''
  }
}

function toSearchParams(search) {
  const query = {}
  for (const [key, value] of new URLSearchParams(search).entries()) {
    query[key] = value
  }
  return query
}
