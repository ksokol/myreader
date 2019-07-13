import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../constants'
import {extractLinks, toUrlString} from './links'

function toEntries(raw = {}) {
  return {
    entries: raw.content,
    links: extractLinks(raw.links)
  }
}

export class EntryApi {

  constructor(api) {
    this.api = api
  }

  fetchEntryTags = () => {
    return this.api.request({
      url: ENTRY_AVAILABLE_TAGS,
      method: 'GET',
    })
  }

  fetchEntries = ({path = SUBSCRIPTION_ENTRIES, query}) => {
    return this.api.request({
      method: 'GET',
      url: toUrlString({path, query}),
    }).then(toEntries)
  }

  updateEntry = ({uuid, seen, tag}) => {
    return this.api.request({
      method: 'PATCH',
      url: `${SUBSCRIPTION_ENTRIES}/${uuid}`,
      body: {seen, tag},
    })
  }
}
