import React from 'react'

const location = {search: ''}
const history = {push: () => null, replace: () => null}

const withRouter = WrappedComponent => {
  return ({children, ...props}) => <WrappedComponent location={location} history={history} {...props} />
}

const Link = () => null
const Redirect = () => null

export {
  Link,
  Redirect,
  withRouter
}
