import {fetchEnd} from '../../../store'
import {isString, toArray} from '../../../shared/utils'

function invokeAction(action, response) {
  return response ? action(response.data, response.headers, response.status) : action()
}

function invokeActionOrActions(actionOrActions, response) {
  return toArray(actionOrActions)
    .map(action => invokeAction(action, response))
    .filter(action => action)
}

export function responseHandler(action, response) {
  const actions = []

  if (response.ok) {
    actions.push(fetchEnd())
    actions.push(...invokeActionOrActions(action.success, response))
    actions.push(...invokeActionOrActions(action.finalize, response))
    return {ok: true, actions}
  }

  const invokedActions = invokeActionOrActions(action.error, response)

  if (invokedActions.length === 0) {
    actions.push(fetchEnd(isString(response.data) ? response.data : JSON.stringify(response)))
  } else {
    actions.push(fetchEnd())
    actions.push(...invokedActions)
  }

  actions.push(...invokeActionOrActions(action.finalize, response))
  return {ok: false, actions}
}
