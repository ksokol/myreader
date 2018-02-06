export default function routerMiddleware(routerHandler) {
     return ({dispatch, getState}) => next => action => {
         if ('ROUTE_CHANGED' === action.type) {
             const state = {...getState().router}
             next(action)
             return routerHandler({action, dispatch, state})
         }
         return next(action)
     }
}
