import {PROCESSING} from '../constants'

export class AdminApi {

  constructor(api) {
    this.api = api
  }

  rebuildSearchIndex = () => {
    return this.api.request({
      url: PROCESSING,
      method: 'PUT',
      body: {process: 'indexSyncJob'}
    }).then(response => response.ok ? {} : Promise.reject(response.data))
  }
}
