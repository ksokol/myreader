const METHODS = ['POST', 'PUT', 'DELETE', 'PATCH', 'GET', 'HEAD']

function supportsType(method) {
    return METHODS.findIndex(it => method.startsWith(it + '_')) !== -1
}

export function createFetchMiddleware(exchangeHandler) {
    return ({dispatch}) => next => action =>
        supportsType(action.type) ? exchangeHandler(action, dispatch) : next(action)
}
