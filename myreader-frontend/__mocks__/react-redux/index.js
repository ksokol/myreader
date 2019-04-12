import React from 'react'

const connect = (mapStateToProps, mapDispatchToProps) => {
  return WrappedComponent => {
    return ({dispatch, state, ...props}) => {
      const stateToProps = mapStateToProps ? {...mapStateToProps(state), ...props} : {...props}
      const dispatchToProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : {}
      return <WrappedComponent {...stateToProps} {...dispatchToProps} dispatch={dispatch} />
    }
  }
}

export {
  connect
}
