import {EXCLUSION_TAGS} from '../constants'

export class SubscriptionExclusionsApi {

  constructor(api) {
    this.api = api
  }

  fetchExclusions = subscriptionUuid => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'GET'
    }).then(({ok, data}) => ok ? data.content : Promise.reject(data))
  }

  saveExclusion = (subscriptionUuid, pattern) => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'POST',
      body: {pattern},
    }).then(({ok, data}) => ok ? data : Promise.reject(data))
  }

  removeExclusion = (subscriptionUuid, uuid) => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern/${uuid}`,
      method: 'DELETE',
    }).then(({ok, data}) => ok ? null : Promise.reject(data))
  }
}
