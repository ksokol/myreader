import {Api} from './Api'
import {AdminApi} from './AdminApi'
import {SubscriptionApi} from './SubscriptionApi'
import {SubscriptionExclusionsApi} from './SubscriptionExclusionsApi'
import {SubscriptionTagsApi} from './SubscriptionTagsApi'
import {EntryApi} from './EntryApi'
import {AuthenticationApi} from './AuthenticationApi'

export const api = new Api()
export const adminApi = new AdminApi()
export const subscriptionApi = new SubscriptionApi()
export const subscriptionExclusionsApi = new SubscriptionExclusionsApi()
export const subscriptionTagsApi = new SubscriptionTagsApi()
export const entryApi = new EntryApi()
export const authenticationApi = new AuthenticationApi()
