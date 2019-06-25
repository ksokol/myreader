import {ENTRY_AVAILABLE_TAGS} from '../constants'

export class EntryApi {

  constructor(api) {
    this.api = api
  }

  fetchEntryTags = () => {
    return this.api.request({
      url: ENTRY_AVAILABLE_TAGS,
      method: 'GET',
    }).then(({ok, data}) => ok ? data : Promise.reject(data))
  }
}
