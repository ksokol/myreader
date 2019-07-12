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
    }).then(({ok, status, headers}) => (
      ok && status >= 200 && status < 400 ? (headers['x-my-authorities'] || '').split(',') : Promise.reject()
    ))
  }

  logout = () => {
    return this.api.request({
      url: LOGOUT,
      method: 'POST'
    }).then(({ok, data}) => ok ? undefined : Promise.reject(data))
  }
}
