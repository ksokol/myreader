import {SUBSCRIPTIONS} from '../constants'

export class SubscriptionApi {

  constructor(api) {
    this.api = api
  }

  subscribe = body => {
    return this.api.request({
      url: SUBSCRIPTIONS,
      method: 'POST',
      body
    }).then(({ok, status, data}) => ok ? data : Promise.reject({status, data}))
  }
}
