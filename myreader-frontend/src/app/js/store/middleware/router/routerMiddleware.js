import {objectEquals} from '../../../shared/utils'

export default function routerMiddleware(routerHandler) {
  return ({dispatch, getState}) => next => action => {
    if ('ROUTE_CHANGED' !== action.type) {
      return next(action)
    }

    const routerState = {...getState().router}

    if (
      action.options && action.options.reload ||
      !objectEquals(routerState.currentRoute, action.route) ||
      !objectEquals(routerState.query, action.query)
    ) {
      next(action)
      return routerHandler({action})
    }
  }
}
