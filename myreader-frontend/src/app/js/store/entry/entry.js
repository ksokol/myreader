import {extractLinks} from '../shared/links'

export function toEntries(raw = {}) {
    const links = extractLinks(raw.links)
    const entries = raw.content || []
    return {entries, links}
}
