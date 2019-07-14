import {LOGIN, LOGOUT} from '../constants'
import {Api} from './Api'

export class AuthenticationApi extends Api {

  login = (username, password) => {
    const searchParams = new URLSearchParams()
    searchParams.set('username', username)
    searchParams.set('password', password)

    return this.request({
      url: LOGIN,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: searchParams,
    })
  }

  logout = () => {
    return this.request({
      url: LOGOUT,
      method: 'POST'
    })
  }
}
