import {SUBSCRIPTIONS} from '../constants'
import {Api} from './Api'

function toSubscriptions(raw = {}) {
  return raw.content
}

export class SubscriptionApi extends Api {

  subscribe = body => {
    return this.request({
      url: SUBSCRIPTIONS,
      method: 'POST',
      body
    })
  }

  fetchSubscriptions = () => {
    return this.request({
      url: SUBSCRIPTIONS,
      method: 'GET',
    }).then(toSubscriptions)
  }
}
