import {fetchEnd} from '../../store'

export class PendingFetchInterceptor {

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  onFinally = () => {
    this.dispatch(fetchEnd())
  }
}
