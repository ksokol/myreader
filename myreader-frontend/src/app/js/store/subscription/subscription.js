import {cloneObject} from '../shared/objects'

export function toSubscriptions(raw = {}) {
    return {
        subscriptions: (raw.content || []).map(it => cloneObject(it))
    }
}
