import {extractLinks, toUrlString} from './links'
import {FEEDS} from '../constants'

function toFeedFetchFailure(raw = {}) {
  return {uuid: raw.uuid, message: raw.message, createdAt: raw.createdAt}
}

function toFeedFetchFailures(raw = {content: []}) {
  const links = extractLinks(raw.links)
  const failures = raw.content.map(toFeedFetchFailure)
  return {failures, links}
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
}
