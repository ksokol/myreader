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

  deleteSubscription = uuid => {
    return this.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'DELETE',
    })
  }

  saveSubscription = subscription => {
    return this.request({
      url: `${SUBSCRIPTIONS}/${subscription.uuid}`,
      method: 'PATCH',
      body: subscription,
    })
  }

  fetchSubscription = uuid => {
    return this.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'GET',
    })
  }

  fetchSubscriptions = () => {
    return this.request({
      url: SUBSCRIPTIONS,
      method: 'GET',
    }).then(toSubscriptions)
  }

  fetchFeedFetchErrors = uuid => {
    return this.request({
      url: `${SUBSCRIPTIONS}/${uuid}/fetchError`,
      method: 'GET'
    })
  }
}
