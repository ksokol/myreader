import {exchange} from './exchange'

export class Api {

  constructor() {
    this.interceptors = {
      then: []
    }
  }

  addInterceptor = interceptor => {
    if (typeof interceptor.onThen === 'function') {
      this.interceptors.then.push(interceptor)
    }
  }

  request = request => {
    return new Promise(resolve => {
      exchange(request).then(response => {
        const interceptors = [...this.interceptors.then]

        const next = chainedResponse => {
          const interceptor = interceptors.shift()

          if (interceptor) {
            interceptor.onThen(chainedResponse, next)
          } else {
            resolve(chainedResponse)
          }
        }

        next(response)
      })
    })
  }
}
