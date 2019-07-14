import {exchange} from './exchange'

let interceptors = []

export class Api {

  addInterceptor = interceptor => interceptors.push(interceptor)

  removeInterceptor = interceptor => interceptors = interceptors.filter(it => it !== interceptor)

  request = request => {
    return new Promise((resolve, reject) => {
      this.findFn('onBefore').forEach(fn => fn(request))

      exchange(request).then(response => {
        this.findFn('onThen').forEach(fn => fn(request, response))
        resolve(response)
      }).catch(error => {
        this.findFn('onError').forEach(fn => fn(request, error))
        reject(error)
      }).finally(() => {
        this.findFn('onFinally').forEach(fn => fn())
      })
    })
  }

  findFn = fn => {
    return interceptors
      .filter(interceptor => typeof interceptor[fn] === 'function')
      .map(interceptor => interceptor[fn])
  }
}
