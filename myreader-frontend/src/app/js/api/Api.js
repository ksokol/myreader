import {exchange} from './exchange'

export class Api {

  constructor() {
    this.interceptors = {
      before: [],
      then: [],
      error: [],
      finally: []
    }
  }

  addInterceptor = interceptor => {
    if (typeof interceptor.onBefore === 'function') {
      this.interceptors.before.push(interceptor)
    }
    if (typeof interceptor.onThen === 'function') {
      this.interceptors.then.push(interceptor)
    }
    if (typeof interceptor.onError === 'function') {
      this.interceptors.error.push(interceptor)
    }
    if (typeof interceptor.onFinally === 'function') {
      this.interceptors.finally.push(interceptor)
    }
  }

  request = request => {
    return new Promise((resolve, reject) => {
      this.interceptors.before.forEach(interceptor => interceptor.onBefore(request))

      exchange(request).then(response => {
        this.interceptors.then.forEach(interceptor => interceptor.onThen(response))
        resolve(response)
      }).catch(error => {
        this.interceptors.error.forEach(interceptor => interceptor.onError(error))
        reject(error)
      }).finally(() => {
        this.interceptors.finally.forEach(interceptor => interceptor.onFinally())
      })
    })
  }
}
