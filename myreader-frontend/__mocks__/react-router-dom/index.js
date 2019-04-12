import React from 'react'

const location = {search: ''}
const history = {push: () => null, replace: () => null}
const match = {params: {}}

const withRouter = WrappedComponent => {
  return ({children, ...props}) => {
    const mergedProps = Object.assign(props, {
      location: props.location || location,
      history: props.history || history,
      match: props.match || match
    })
    return <WrappedComponent {...mergedProps} />
  }
}

const Link = () => null
const Redirect = () => null

export {
  Link,
  Redirect,
  withRouter
}
