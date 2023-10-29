import React, {useEffect} from 'react'
import {hashPrefix, useRouter} from '../contexts/router'

export function Switch({children, onNotFound}) {
  const {route} = useRouter()
  let element, match

  React.Children.forEach(children, child => {
    if (match == null) {
      element = child

      if (matchesRoute(route.pathname, child.props.path, child.props.partial)) {
        match = true
      }
    }
  })

  return match
    ? React.cloneElement(element)
    : onNotFound()
}

export function Route({path, partial, children}) {
  const {route} = useRouter()
  return matchesRoute(route.pathname, path, partial) ? children : null
}

export function Redirect({pathname, search = ''}) {
  const {replaceRoute} = useRouter()

  useEffect(() => {
    replaceRoute({pathname, search})
  }, [pathname, replaceRoute, search])

  return null
}

export function Link({to = {}, className, onClick, children}) {
  const {
    pathname = '',
    search = '',
  } = to

  return (
    <a
      href={`${hashPrefix}${pathname}${search}`}
      className={className}
      onClick={(event) => {
        onClick && onClick(event)
      }}
    >
      {children}
    </a>
  )
}

function matchesRoute(currentPathname, newPathname, partial) {
  return (partial && currentPathname.startsWith(newPathname)) || currentPathname === newPathname
}
