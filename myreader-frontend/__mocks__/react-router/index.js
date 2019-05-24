import React from 'react'
import {generatePath} from 'react-router'

const location = {search: ''}
const history = {push: () => null, replace: () => null}
const match = {params: {}}

/* eslint-disable react/prop-types */
const withRouter = WrappedComponent => {
  return ({children, ...props}) => {
    const mergedProps = Object.assign(props, {
      location: props.location || location,
      history: props.history || history,
      match: props.match || match
    })
    return <WrappedComponent {...mergedProps}>{children}</WrappedComponent>
  }
}
/* eslint-enable */

export {
  withRouter,
  generatePath
}
