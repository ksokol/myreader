import {extractLinks} from 'store/shared/links'

export function toFeed(raw = {}) {
    const {links, ...rest} = raw
    return {...rest, links: extractLinks(links)}
}

export function toFeeds(raw = {}) {
    const feeds = (raw.content || []).map(toFeed)
    return {feeds}
}

export function toFeedFetchFailure(raw = {}) {
    return {uuid: raw.uuid, message: raw.message, createdAt: raw.createdAt}
}

export function toFeedFetchFailures(raw = {content: [], page: {}}) {
    const links = extractLinks(raw.links)
    const failures = raw.content.map(toFeedFetchFailure)
    return {failures, links}
}
