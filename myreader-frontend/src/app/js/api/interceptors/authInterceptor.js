import {unauthorized} from '../../store'

export function authInterceptor(dispatch) {
  return (response, next) => {
    if (response.status === 401) {
      dispatch(unauthorized())
    } else {
      next(response)
    }
  }
}
