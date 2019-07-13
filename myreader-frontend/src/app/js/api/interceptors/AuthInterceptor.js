import {unauthorized} from '../../store'

export class AuthInterceptor {

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  onError = ({status}) => {
    if (status === 401) {
      this.dispatch(unauthorized())
    }
  }
}
