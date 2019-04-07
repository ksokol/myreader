import React from 'react'

const connect = (mapStateToProps, mapDispatchToProps) => {
  return WrappedComponent => {
    return ({dispatch, ...state}) => {
      const stateToProps = mapStateToProps ? mapStateToProps(state) : {}
      const dispatchToProps = mapDispatchToProps ? mapDispatchToProps(dispatch) : {}
      const props = {...stateToProps, ...dispatchToProps, dispatch}
      return <WrappedComponent {...props} />
    }
  }
}

export {
  connect
}
