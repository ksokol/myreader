import {fetchEnd, unauthorized} from 'store'
import {toArray} from 'shared/utils'

function invokeActionCreator(actionCreator, response) {
    return actionCreator(response.data, response.headers)
}

function toActions(actionCreator, response) {
    return toArray(actionCreator)
        .map(creator => invokeActionCreator(creator, response))
        .filter(action => action)
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
        actions.push(...toActions(action.success, response))
        return {ok: true, actions}
    }

    if (isUnauthorized(response)) {
        actions.push(fetchEnd())
        actions.push(unauthorized())
        return {ok: false, actions}
    }

    if (action.error && response.status !== 400) {
        actions.push(fetchEnd())
        actions.push(...toActions(action.error, response))
        return {ok: false, actions}
    }

    actions.push(fetchEnd(response.status !== 400 ? response.data : null))
    return {ok: false, actions}
}
