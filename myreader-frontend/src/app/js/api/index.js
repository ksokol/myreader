export {AuthInterceptor} from './interceptors/AuthInterceptor'
export {PendingFetchInterceptor} from './interceptors/PendingFetchInterceptor'
import {Api} from './Api'

export const api = new Api()
