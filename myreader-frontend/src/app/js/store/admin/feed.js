import {extractLinks} from '../../api/links'

export function toFeed(raw = {}) {
  const {links, ...rest} = raw
  return {...rest, links: extractLinks(links)}
}

export function toFeeds(raw = {}) {
  const feeds = (raw.content || []).map(toFeed)
  return {feeds}
}
