import {LOGOUT} from '../constants'
import {Api} from './Api'

export class AuthenticationApi extends Api {

  logout = () => {
    return this.request({
      url: LOGOUT,
      method: 'POST'
    })
  }
}
