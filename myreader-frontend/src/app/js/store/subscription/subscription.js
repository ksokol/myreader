import {cloneObject} from '../shared/objects'

function toSubscription(raw = {}) {
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

export function toSubscriptions(raw = {}) {
  return (raw.content || []).map(toSubscription)
}
