import React from 'react'
import {ReactReduxContext, Provider} from 'react-redux'

const connect = (mapStateToProps, mapDispatchToProps) => {
  return WrappedComponent => {
    return ({dispatch, state, ...props}) => {
      const stateToProps = mapStateToProps ? {...mapStateToProps(state, props), ...props} : {...props}
      const dispatchToProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : {}
      return <WrappedComponent {...stateToProps} {...dispatchToProps} dispatch={dispatch} />
    }
  }
}

export {
  connect,
  Provider,
  ReactReduxContext
}
