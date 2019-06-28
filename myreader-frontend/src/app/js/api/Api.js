import {exchange} from './exchange'

export class Api {

  constructor() {
    this.interceptors = {
      before: [],
      then: []
    }
  }

  addInterceptor = interceptor => {
    if (typeof interceptor.onBefore === 'function') {
      this.interceptors.before.push(interceptor)
    }
    if (typeof interceptor.onThen === 'function') {
      this.interceptors.then.push(interceptor)
    }
  }

  request = request => {
    return new Promise(resolve => {
      this.interceptors.before.forEach(interceptor => interceptor.onBefore())

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
