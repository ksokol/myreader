import React, {useEffect} from 'react'
import {hashPrefix, useRouter} from '../contexts/router'
import PropTypes from 'prop-types'

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

Switch.propTypes = {
  onNotFound: PropTypes.any.isRequired,
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export function Route({path, partial, children}) {
  const {route} = useRouter()
  return matchesRoute(route.pathname, path, partial) ? children : null
}

Route.propTypes = {
  path: PropTypes.string.isRequired,
  partial: PropTypes.bool,
  children: PropTypes.any,
}

export function Redirect({pathname, search = ''}) {
  const {replaceRoute} = useRouter()

  useEffect(() => {
    replaceRoute({pathname, search})
  }, [pathname, replaceRoute, search])

  return null
}

Redirect.propTypes = {
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string,
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

Link.propTypes = {
  to: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.any,
}

function matchesRoute(currentPathname, newPathname, partial) {
  return (partial && currentPathname.startsWith(newPathname)) || currentPathname === newPathname
}
