import React from 'react'

const connect = (mapStateToProps, mapDispatchToProps) => {
  return WrappedComponent => {
    return ({props, dispatch, state}) => {
      const stateToProps = mapStateToProps ? {...mapStateToProps(state), ...props} : {...props}
      const dispatchToProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : {}
      return <WrappedComponent {...stateToProps} {...dispatchToProps} dispatch={dispatch} />
    }
  }
}

export {
  connect
}
