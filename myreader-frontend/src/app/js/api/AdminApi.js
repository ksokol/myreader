import {INFO} from '../constants'
import {Api} from './Api'

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

export class AdminApi extends Api {

  fetchApplicationInfo = () => {
    return this.request({
      url: INFO,
      method: 'GET',
    }).then(toApplicationInfo)
  }
}
