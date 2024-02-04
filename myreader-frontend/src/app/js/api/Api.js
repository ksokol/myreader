import {exchange} from './exchange'

let interceptors = []

export class Api {

  addInterceptor = interceptor => interceptors.push(interceptor)

  removeInterceptor = interceptor => interceptors = interceptors.filter(it => it !== interceptor)

  get = ({context = {}, ...incomingRequest}) => {
    return this.request({context, ...incomingRequest, method: 'GET'})
  }

  post = ({context = {}, ...incomingRequest}) => {
    return this.request({context, ...incomingRequest, method: 'POST'})
  }

  patch = ({context = {}, ...incomingRequest}) => {
    return this.request({context, ...incomingRequest, method: 'PATCH'})
  }

  delete = ({context = {}, ...incomingRequest}) => {
    return this.request({context, ...incomingRequest, method: 'DELETE'})
  }

  request = async ({context = {}, ...incomingRequest}) => {
    const request = {...incomingRequest, context}

    try {
      for (const fn of this.findFn('onBefore')) {
        fn(request)
      }
      const response = await exchange(request)
      for (const fn of this.findFn('onThen')) {
        fn(request, response)
      }
      return response
    } catch (error) {
      for (const fn of this.findFn('onError')) {
        fn(request, error)
      }
      throw error
    } finally {
      for (const fn of this.findFn('onFinally')) {
        fn()
      }
    }
  }

  findFn = fn => {
    return interceptors
      .filter(interceptor => typeof interceptor[fn] === 'function')
      .map(interceptor => interceptor[fn])
  }
}
