import {arrayIncludes, toArray, isDefined} from '../../../shared/utils'

function traverseAndDispatch({action, dispatch, routerState, getState}) {
  if (action.redirect) {
    const redirectAction = action.redirect({dispatch, getState})
    if (isDefined(redirectAction)) {
      dispatch(redirectAction)
      return false
    }
  }
  if (action.parent) {
    const proceed = traverseAndDispatch({action: action.parent, dispatch, routerState, getState})
    if (!proceed) {
      return false
    }
  }
  if (!arrayIncludes(action.route, routerState.currentRoute)) {
    toArray(action.before).forEach(beforeAction => dispatch(beforeAction({getState})))
  }
  toArray(action.resolve).forEach(resolveAction => dispatch(resolveAction({query: action.query, getState})))
  return true
}

export default function routerHandler(routerAdapter) {
  return ({action, dispatch, routerState, getState}) => {
    const proceed = traverseAndDispatch({action, dispatch, routerState, getState})
    return proceed && routerAdapter(action)
  }
}
