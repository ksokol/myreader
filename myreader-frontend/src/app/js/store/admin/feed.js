import {extractLinks} from '../shared/links'

export function toFeedFetchFailure(raw = {}) {
    return {uuid: raw.uuid, message: raw.message, createdAt: raw.createdAt}
}

export function toFeedFetchFailures(raw = {content: [], page: {}}) {
    const links = extractLinks(raw.links)
    const failures = raw.content.map(toFeedFetchFailure)
    const totalElements = raw.page.totalElements || 0
    return {failures, links, totalElements}
}