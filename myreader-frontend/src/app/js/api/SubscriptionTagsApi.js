import {SUBSCRIPTION_TAGS} from '../constants'

export class SubscriptionTagsApi {

  constructor(api) {
    this.api = api
  }

  fetchSubscriptionTags = () => {
    return this.api.request({
      url: SUBSCRIPTION_TAGS,
      method: 'GET',
    })
  }

  saveSubscriptionTag = subscriptionTag => {
    return this.api.request({
      url: `${SUBSCRIPTION_TAGS}/${subscriptionTag.uuid}`,
      method: 'PATCH',
      body: subscriptionTag,
    })
  }
}
