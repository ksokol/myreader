import {LOGOUT} from '../constants'

export class AuthenticationApi {

  constructor(api) {
    this.api = api
  }

  logout = () => {
    return this.api.request({
      url: LOGOUT,
      method: 'POST'
    }).then(({ok, data}) => ok ? undefined : Promise.reject(data))
  }
}
