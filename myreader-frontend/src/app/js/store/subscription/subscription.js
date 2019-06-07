import {cloneObject} from '../shared/objects'
import {isString} from '../../shared/utils'

export function toSubscription(raw = {}) {
  const clone = cloneObject(raw)

  if (clone.feedTag === null || typeof clone.feedTag === 'undefined') {
    clone.feedTag = {
      uuid: undefined,
      name: undefined,
      color: undefined,
      links: [] // TODO deprecated
    }
  }

  return clone
}

export function toBody(subscription) {
  const clone = cloneObject(subscription)

  if (!clone.feedTag || !isString(clone.feedTag.name)) {
    clone.feedTag = null
  }

  return clone
}

export function toSubscriptions(raw = {}) {
  return (raw.content || []).map(toSubscription)
}
