import {INFO, PROCESSING} from '../constants'

const noApplicationInfo = {
  git: {
    branch: 'not available',
    commit: {
      id: 'not available'
    }
  },
  build: {
    version: 'not available',
    time: ''
  }
}

function toApplicationInfo(raw = {}) {
  const {git, build} = raw.git ? raw : noApplicationInfo
  return {
    branch: git.branch,
    commitId: git.commit.id,
    version: build.version,
    buildTime: build.time
  }
}

export class AdminApi {

  constructor(api) {
    this.api = api
  }

  rebuildSearchIndex = () => {
    return this.api.request({
      url: PROCESSING,
      method: 'PUT',
      body: {process: 'indexSyncJob'}
    }).then(({ok, data}) => ok ? {} : Promise.reject(data))
  }

  fetchApplicationInfo = () => {
    return this.api.request({
      url: INFO,
      method: 'GET',
    }).then(({ok, data}) => ok ? toApplicationInfo(data) : Promise.reject(data))
  }
}
