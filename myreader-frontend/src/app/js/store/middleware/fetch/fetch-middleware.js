const METHODS = ['POST', 'PUT', 'DELETE', 'PATCH', 'GET', 'HEAD']

function supportsType(method) {
    return METHODS.findIndex(it => method.startsWith(it + '_')) !== -1
}

function toArguments(action) {
    return {
        url: action.url,
        method: action.type.split('_')[0],
        headers: action.headers ? action.headers : {},
        body: action.body
    }
}

function isFunction(value) {
    return typeof value === 'function'
}

function handleResponse(cb, dispatch, response) {
    if (isFunction(cb)) {
        dispatch(cb(response))
    }
}

export function createFetchMiddleware(exchange) {
    return ({dispatch}) => next => action => {
        if (!supportsType(action.type)) {
            return next(action)
        }

        return exchange(toArguments(action)).call(this, dispatch)
            .then(response => handleResponse(action.success, dispatch, response))
            .catch(error => handleResponse(action.error, dispatch, error))
    }
}
