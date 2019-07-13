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

export function toSubscriptions(raw = {}) {
  return raw.content.map(toSubscription)
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
    })
  }

  deleteSubscription = uuid => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'DELETE',
    })
  }

  saveSubscription = subscription => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${subscription.uuid}`,
      method: 'PATCH',
      body: toBody(subscription),
    })
  }

  fetchSubscription = uuid => {
    return this.api.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'GET',
    }).then(toSubscription)
  }

  fetchSubscriptions = () => {
    return this.api.request({
      url: SUBSCRIPTIONS,
      method: 'GET',
    }).then(toSubscriptions)
  }
}
