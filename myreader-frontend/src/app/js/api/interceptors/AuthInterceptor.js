import {unauthorized} from '../../store'

export class AuthInterceptor {

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  onError = (request, error) => {
    if (error.status === 401) {
      this.dispatch(unauthorized())
    }
  }
}
