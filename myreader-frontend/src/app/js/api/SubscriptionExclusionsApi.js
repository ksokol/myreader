import {EXCLUSION_TAGS} from '../constants'

export class SubscriptionExclusionsApi {

  constructor(api) {
    this.api = api
  }

  fetchExclusions = subscriptionUuid => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'GET'
    })
  }

  saveExclusion = (subscriptionUuid, pattern) => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'POST',
      body: {pattern},
    })
  }

  removeExclusion = (subscriptionUuid, uuid) => {
    return this.api.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern/${uuid}`,
      method: 'DELETE',
    })
  }
}
