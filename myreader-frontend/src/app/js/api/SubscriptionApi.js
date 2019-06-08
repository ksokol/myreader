import {SUBSCRIPTIONS} from '../constants'
import {isString} from '../shared/utils'

function toBody(subscription) {
  const clone = {...subscription}
  if (!clone.feedTag || !isString(clone.feedTag.name)) {
    clone.feedTag = null
  }
  return clone
}

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

  deleteSubscription = uuid => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'DELETE',
    }).then(({ok, data}) => ok ? null : Promise.reject(data))
  }

  saveSubscription = subscription => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${subscription.uuid}`,
      method: 'PATCH',
      body: toBody(subscription),
    }).then(({ok, data}) => ok ? null : Promise.reject(data))
  }
}
