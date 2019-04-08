import React from 'react'

const location = {search: ''}
const history = {push: () => null, replace: () => null}
const match = {params: {}}

const withRouter = WrappedComponent => {
  return ({children, ...props}) => <WrappedComponent location={location} history={history} match={match} {...props} />
}

const Link = () => null
const Redirect = () => null

export {
  Link,
  Redirect,
  withRouter
}
