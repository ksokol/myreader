import {fetchEnd, fetchStart} from '../../store'

export class PendingFetchInterceptor {

  constructor(dispatch) {
    this.dispatch = dispatch
  }

  onBefore = () => {
    this.dispatch(fetchStart())
  }

  onFinally = () => {
    this.dispatch(fetchEnd())
  }
}