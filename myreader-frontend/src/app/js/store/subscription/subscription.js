import {cloneObject} from '../shared/objects'

export function toSubscription(raw = {}) {
    return cloneObject(raw)
}

export function toSubscriptions(raw = {}) {
    return (raw.content || []).map(toSubscription)
}

export function byPattern(left, right) {
    return left.pattern < right.pattern ? -1 : left.pattern === right.pattern ? 0 : 1
}

export function toExclusionPattern(raw = {}) {
    return {...raw}
}

export function toExclusionPatterns(raw = {content: []}) {
    return raw.content.map(toExclusionPattern).sort(byPattern)
}
