import {unauthorized} from '../../store'

export class AuthInterceptor {

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  onThen = (response, next) => {
    if (response.status === 401) {
      this.dispatch(unauthorized())
    } else {
      next(response)
    }
  }
}
