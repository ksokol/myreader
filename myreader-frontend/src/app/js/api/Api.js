import {exchange} from './exchange'

export class Api {

  constructor() {
    this.interceptors = []
  }

  addInterceptor = interceptor => this.interceptors.push(interceptor)

  removeInterceptor = interceptor => this.interceptors = this.interceptors.filter(it => it !== interceptor)

  request = request => {
    return new Promise((resolve, reject) => {
      this.findFn('onBefore').forEach(fn => fn(request))

      exchange(request).then(response => {
        this.findFn('onThen').forEach(fn => fn(response))
        resolve(response)
      }).catch(error => {
        this.findFn('onError').forEach(fn => fn(error))
        reject(error)
      }).finally(() => {
        this.findFn('onFinally').forEach(fn => fn())
      })
    })
  }

  findFn = fn => {
    return this.interceptors
      .filter(interceptor => typeof interceptor[fn] === 'function')
      .map(interceptor => interceptor[fn])
  }
}
