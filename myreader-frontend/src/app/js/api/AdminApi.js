import {INFO, PROCESSING} from '../constants'

const defaultText = 'not available'

const noApplicationInfo = {
  git: {
    branch: defaultText,
    commit: {
      id: defaultText
    }
  },
  build: {
    version: defaultText,
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
    })
  }

  fetchApplicationInfo = () => {
    return this.api.request({
      url: INFO,
      method: 'GET',
    }).then(toApplicationInfo)
  }
}
