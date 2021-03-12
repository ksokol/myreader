import {SUBSCRIPTIONS} from '../constants'
import {Api} from './Api'

function toSubscriptions(raw = {}) {
  return raw.content
}

export class SubscriptionApi extends Api {

  fetchSubscriptions = () => {
    return this.request({
      url: SUBSCRIPTIONS,
      method: 'GET',
    }).then(toSubscriptions)
  }
}
