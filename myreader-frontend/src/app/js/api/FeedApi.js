import {extractLinks, toUrlString} from './links'
import {FEEDS} from '../constants'

function toFeedFetchFailure(raw = {}) {
  return {
    uuid: raw.uuid,
    message: raw.message,
    createdAt: raw.createdAt
  }
}

function toFeedFetchFailures(raw = {content: []}) {
  const links = extractLinks(raw.links)
  const failures = raw.content.map(toFeedFetchFailure)
  return {
    failures,
    links
  }
}

function toFeed(raw = {}) {
  const {links, ...rest} = raw
  return {
    ...rest,
    links: extractLinks(links)
  }
}

export function toFeeds(raw = {}) {
  return (raw.content || []).map(toFeed)
}

export class FeedApi {

  constructor(api) {
    this.api = api
  }

  fetchFeedFetchErrors = uuidOrLink => {
    const url = typeof uuidOrLink === 'object'
      ? toUrlString(uuidOrLink)
      : `${FEEDS}/${uuidOrLink}/fetchError`

    return this.api.request({
      url,
      method: 'GET'
    }).then(({ok, data}) => ok ? toFeedFetchFailures(data) : Promise.reject(data))
  }

  fetchFeeds = () => {
    return this.api.request({
      url: FEEDS,
      method: 'GET'
    }).then(({ok, data}) => ok ? toFeeds(data) : Promise.reject(data))
  }

  fetchFeed = uuid => {
    return this.api.request({
      url: `${FEEDS}/${uuid}`,
      method: 'GET'
    }).then(({ok, data}) => ok ? toFeed(data) : Promise.reject(data))
  }

  saveFeed = body => {
    return this.api.request({
      url: `${FEEDS}/${body.uuid}`,
      method: 'PATCH',
      body
    }).then(({ok, status, data}) => ok ? null : Promise.reject({status, data}))
  }

  deleteFeed = uuid => {
    return this.api.request({
      url: `${FEEDS}/${uuid}`,
      method: 'DELETE'
    }).then(({ok, status, data}) => ok ? null : Promise.reject({status, data}))
  }
}
