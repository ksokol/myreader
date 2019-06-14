export {AuthInterceptor} from './interceptors/AuthInterceptor'
export {PendingFetchInterceptor} from './interceptors/PendingFetchInterceptor'

import {Api} from './Api'
import {AdminApi} from './AdminApi'
import {FeedApi} from './FeedApi'
import {SubscriptionApi} from './SubscriptionApi'
import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {SubscriptionTagsApi} from './subscription-tags-api'

export const api = new Api()
export const adminApi = new AdminApi(api)
export const feedApi = new FeedApi(api)
export const subscriptionApi = new SubscriptionApi(api)
export const subscriptionExclusionsApi = new SubscriptionExclusionsApi(api)
export const subscriptionTagsApi = new SubscriptionTagsApi(api)
