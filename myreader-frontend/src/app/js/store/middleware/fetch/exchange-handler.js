import {fetchStart} from '../../../store'

function toArguments(action) {
  return {
    url: action.url,
    method: action.type.split('_')[0],
    headers: action.headers ? action.headers : {},
    body: action.body
  }
}

function beforeExchange(action, dispatch) {
  if (action.before) {
    dispatch(action.before())
  }
  dispatch(fetchStart())
}

export function createExchangeHandler(exchange, responseHandler) {
  return (action, dispatch) => {
    beforeExchange(action, dispatch)

    return new Promise((resolve, reject) =>
      exchange(toArguments(action)).then(response => {
        const result = responseHandler(action, response)
        dispatch(result.actions)
        result.ok ? resolve(response.data) : reject(response)
      })
    )
  }
}
