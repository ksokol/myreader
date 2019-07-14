import {EXCLUSION_TAGS} from '../constants'
import {Api} from './Api'

export class SubscriptionExclusionsApi extends Api {

  fetchExclusions = subscriptionUuid => {
    return this.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'GET'
    })
  }

  saveExclusion = (subscriptionUuid, pattern) => {
    return this.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern`,
      method: 'POST',
      body: {pattern},
    })
  }

  removeExclusion = (subscriptionUuid, uuid) => {
    return this.request({
      url: `${EXCLUSION_TAGS}/${subscriptionUuid}/pattern/${uuid}`,
      method: 'DELETE',
    })
  }
}
