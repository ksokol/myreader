import {arrayIncludes, toArray} from 'shared/utils'

function traverseAndDispatch({action, dispatch, state}) {
    if (action.parent) {
        traverseAndDispatch({action: action.parent, dispatch, state})
    }
    if (!arrayIncludes(action.route, state.currentRoute)) {
        toArray(action.before).forEach(beforeAction => dispatch(beforeAction()))
    }
    toArray(action.resolve).forEach(resolveAction => dispatch(resolveAction(action.query)))
}

export default function routerHandler(routerAdapter) {
    return ({action, dispatch, state}) => {
        traverseAndDispatch({action, dispatch, state})
        return routerAdapter(action)
    }
}
