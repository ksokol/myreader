import {arrayIncludes, toArray} from '../../../shared/utils'

function traverseAndDispatch({action, dispatch, routerState, getState}) {
    if (action.parent) {
        traverseAndDispatch({action: action.parent, dispatch, routerState, getState})
    }
    if (!arrayIncludes(action.route, routerState.currentRoute)) {
        toArray(action.before).forEach(beforeAction => dispatch(beforeAction({getState})))
    }
    toArray(action.resolve).forEach(resolveAction => dispatch(resolveAction({query: action.query, getState})))
}

export default function routerHandler(routerAdapter) {
    return ({action, dispatch, routerState, getState}) => {
        traverseAndDispatch({action, dispatch, routerState, getState})
        return routerAdapter(action)
    }
}
