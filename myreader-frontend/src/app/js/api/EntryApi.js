import {ENTRY_AVAILABLE_TAGS, SUBSCRIPTION_ENTRIES} from '../constants'
import {toLink, toUrlString} from './links'
import {Api} from './Api'

function toEntries(raw = {}) {
  const links = {}

  if (raw.next) {
    links.next = toLink(raw.next)
  }

  return {
    entries: raw.content,
    links,
  }
}

export class EntryApi extends Api {

  fetchEntryTags = () => {
    return this.request({
      url: ENTRY_AVAILABLE_TAGS,
      method: 'GET',
    })
  }

  fetchEntries = ({path = SUBSCRIPTION_ENTRIES, query}) => {
    return this.request({
      method: 'GET',
      url: toUrlString({path, query}),
    }).then(toEntries)
  }

  updateEntry = ({uuid, seen, tags, context}) => {
    return this.request({
      method: 'PATCH',
      url: `${SUBSCRIPTION_ENTRIES}/${uuid}`,
      body: {seen, tags},
      context
    })
  }
}
