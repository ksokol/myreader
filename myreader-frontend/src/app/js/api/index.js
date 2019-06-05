export {AuthInterceptor} from './interceptors/AuthInterceptor'
export {PendingFetchInterceptor} from './interceptors/PendingFetchInterceptor'
import {Api} from './Api'
import {AdminApi} from './AdminApi'
import {FeedApi} from './FeedApi'
import {SubscriptionApi} from './SubscriptionApi'

export const api = new Api()
export const adminApi = new AdminApi(api)
export const feedApi = new FeedApi(api)
export const subscriptionApi = new SubscriptionApi(api)
