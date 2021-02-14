import {SUBSCRIPTIONS} from '../constants'
import {Api} from './Api'
import {extractLinks, toUrlString} from './links'

function toSubscriptions(raw = {}) {
  return raw.content
}

function toFeedFetchFailure(raw = {}) {
  return {
    uuid: raw.uuid,
    message: raw.message,
    createdAt: raw.createdAt
  }
}

function toFeedFetchFailures(raw) {
  const links = extractLinks(raw.links)
  const failures = raw.content.map(it => toFeedFetchFailure(it))
  return {
    failures,
    links
  }
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

  fetchFeedFetchErrors = uuidOrLink => {
    const url = typeof uuidOrLink === 'object'
      ? toUrlString(uuidOrLink)
      : `${SUBSCRIPTIONS}/${uuidOrLink}/fetchError`

    return this.request({
      url,
      method: 'GET'
    }).then(toFeedFetchFailures)
  }
}
