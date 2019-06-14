import {SUBSCRIPTIONS} from '../constants'
import {isString} from '../shared/utils'

export function toSubscription(raw = {}) {
  if (raw.feedTag === null || typeof raw.feedTag === 'undefined') {
    raw.feedTag = {
      uuid: undefined,
      name: undefined,
      color: undefined
    }
  }
  return raw
}

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

  fetchSubscription = uuid => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'GET',
    }).then(({ok, data}) => ok ? toSubscription(data) : Promise.reject(data))
  }
}
