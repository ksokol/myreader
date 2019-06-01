import {extractLinks} from '../../api/links'

export function toEntry(raw = {}) {
  return {...raw}
}

export function toEntries(raw = {}) {
  const links = extractLinks(raw.links)
  const entries = (raw.content || []).map(toEntry)
  return {entries, links}
}
