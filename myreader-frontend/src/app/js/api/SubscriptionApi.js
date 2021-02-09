import {SUBSCRIPTIONS} from '../constants'
import {isString} from '../shared/utils'
import {Api} from './Api'
import {extractLinks, toUrlString} from './links'

function toSubscription(raw = {}) {
  if (raw.feedTag === null || typeof raw.feedTag === 'undefined') {
    raw.feedTag = {
      uuid: undefined,
      name: undefined,
      color: undefined
    }
  }
  return raw
}

function toSubscriptions(raw = {}) {
  return raw.content.map(toSubscription)
}

function toBody(subscription) {
  const clone = {...subscription}
  if (!clone.feedTag || !isString(clone.feedTag.name)) {
    clone.feedTag = null
  }
  return clone
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
      body: toBody(subscription),
    })
  }

  fetchSubscription = uuid => {
    return this.request({
      url: `${SUBSCRIPTIONS}/${uuid}`,
      method: 'GET',
    }).then(toSubscription)
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
