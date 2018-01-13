import {cloneObject} from '../shared/objects'

export function toSubscriptions(raw = {}) {
    return {
        subscriptions: (raw.content || []).map(it => cloneObject(it))
    }
}

function byPattern(left, right) {
    return left.pattern < right.pattern ? -1 : left.pattern === right.pattern ? 0 : 1
}

export function toExclusionPatterns(raw = {content: []}) {
    return raw.content.map(cloneObject).sort(byPattern)
}
