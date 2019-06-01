export {AuthInterceptor} from './interceptors/AuthInterceptor'
export {PendingFetchInterceptor} from './interceptors/PendingFetchInterceptor'
import {Api} from './Api'
import {AdminApi} from './AdminApi'

export const api = new Api()
export const adminApi = new AdminApi(api)
