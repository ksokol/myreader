import {LOGIN, LOGOUT} from '../constants'

export class AuthenticationApi {

  constructor(api) {
    this.api = api
  }

  login = (username, password) => {
    const searchParams = new URLSearchParams()
    searchParams.set('username', username)
    searchParams.set('password', password)

    return this.api.request({
      url: LOGIN,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: searchParams,
    })
  }

  logout = () => {
    return this.api.request({
      url: LOGOUT,
      method: 'POST'
    })
  }
}
