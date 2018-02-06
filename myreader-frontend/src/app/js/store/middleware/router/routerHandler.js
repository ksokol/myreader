import {arrayEquals, toArray} from 'shared/utils'

export default function routerHandler(routerAdapter) {
    return ({action, dispatch, state}) => {
        if (!arrayEquals(state.currentRoute, action.route)) {
            toArray(action.before).forEach(beforeAction => dispatch(beforeAction()))
        }
        toArray(action.resolve).forEach(resolveAction => dispatch(resolveAction(action.query)))
        return routerAdapter(action)
    }
}
