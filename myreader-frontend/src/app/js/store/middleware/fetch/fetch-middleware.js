import {supportedMethods} from './exchange'

function toArguments(action) {
    return {
        url: action.url,
        method: action.type,
        headers: action.headers ? action.headers : {},
        body: action.body
    }
}

function isFunction(value) {
    return typeof value === 'function'
}

function handleResponse(cb, dispatch, response) {
    if (isFunction(cb)) {
        dispatch(cb(response));
    }
}

export function createFetchMiddleware(exchange) {
    const methods = supportedMethods()

    return ({dispatch}) => next => action => {
        if (!methods.includes(action.type)) {
            return next(action)
        }

        return exchange(toArguments(action)).call(this, dispatch)
            .then(response => handleResponse(action.success, dispatch, response))
            .catch(error => handleResponse(action.error, dispatch, error))
    }
}
