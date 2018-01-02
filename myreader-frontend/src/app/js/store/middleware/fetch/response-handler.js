import {fetchEnd, unauthorized} from 'store'

function isFunction(value) {
    return typeof value === 'function'
}

function appendActions(callbackAction, payload, actions) {
    if (isFunction(callbackAction)) {
        actions.push(callbackAction(payload))
    }
    if (Array.isArray(callbackAction)) {
        callbackAction.forEach(callback => actions.push(callback(payload)))
    }
}

function isSuccess(response) {
    return response.ok
}

function isUnauthorized(response) {
    return response.status === 401
}

export function responseHandler(action, response) {
    const actions = []

    if (isSuccess(response)) {
        actions.push(fetchEnd())
        appendActions(action.success, response.data, actions)
        return {ok: true, actions}
    }

    if (isUnauthorized(response)) {
        actions.push(fetchEnd())
        actions.push(unauthorized())
        return {ok: false, actions}
    }

    if (action.error && response.status !== 400) {
        actions.push(fetchEnd())
        appendActions(action.error, response.data, actions)
        return {ok: false, actions}
    }

    actions.push(fetchEnd(response.status !== 400 ? response.data : null))
    return {ok: false, actions}
}
