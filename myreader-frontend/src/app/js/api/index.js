export {PendingFetchInterceptor} from './interceptors/PendingFetchInterceptor'

import {Api} from './Api'
import {AdminApi} from './AdminApi'
import {FeedApi} from './FeedApi'
import {SubscriptionApi} from './SubscriptionApi'
import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {SubscriptionTagsApi} from './SubscriptionTagsApi'
import {EntryApi} from './EntryApi'
import {AuthenticationApi} from './AuthenticationApi'

export const api = new Api()
export const adminApi = new AdminApi()
export const feedApi = new FeedApi()
export const subscriptionApi = new SubscriptionApi()
export const subscriptionExclusionsApi = new SubscriptionExclusionsApi()
export const subscriptionTagsApi = new SubscriptionTagsApi()
export const entryApi = new EntryApi()
export const authenticationApi = new AuthenticationApi()
