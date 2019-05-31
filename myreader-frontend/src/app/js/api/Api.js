import {exchange} from './exchange'

export class Api {

  constructor() {
    this.interceptors = {
      response: []
    }
  }

  addResponseInterceptor = interceptor => this.interceptors.response.push(interceptor)

  request = request => {
    return new Promise(resolve => {
      exchange(request).then(response => {
        const interceptors = [...this.interceptors.response]

        const next = chainedResponse => {
          const interceptor = interceptors.shift()

          if (interceptor) {
            interceptor(chainedResponse, next)
          } else {
            resolve(chainedResponse)
          }
        }

        next(response)
      })
    })
  }
}
