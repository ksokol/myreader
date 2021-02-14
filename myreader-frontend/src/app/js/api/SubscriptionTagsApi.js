import {SUBSCRIPTION_TAGS} from '../constants'
import {Api} from './Api'

export class SubscriptionTagsApi extends Api {

  fetchSubscriptionTags = () => {
    return this.request({
      url: SUBSCRIPTION_TAGS,
      method: 'GET',
    })
  }
}
