export default function routerMiddleware(routerHandler) {
     return ({dispatch, getState}) => next => action => {
         if ('ROUTE_CHANGED' === action.type) {
             const routerState = {...getState().router}
             next(action)
             return routerHandler({action, dispatch, routerState, getState})
         }
         return next(action)
     }
}
