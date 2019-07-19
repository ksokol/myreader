import {SUBSCRIPTION_ENTRIES} from '../../constants'

const urlPattern = new RegExp(`[.*/]?${SUBSCRIPTION_ENTRIES}/[a-z0-9\\-].*$`)

export class SubscriptionProviderInterceptor {

  requests = []

  constructor(cb) {
    this.cb = cb
  }

  onBefore = request => {
    if (this.requestMatchesPattern(request) && this.isExpectedRequest(request)) {
      this.requests.push(request)
    }
  }

  onThen = (request, response) => {
    if (this.requestMatchesUrl(request) && this.isExpectedRequest(request)) {
      this.cb(response, request.context.oldValue)
    }

    this.removeRequest(request)
  }

  onError = request => {
    if (this.requestMatchesUrl(request) && this.isExpectedMethod(request)) {
      this.removeRequest(request)
    }
  }

  removeRequest = request => {
    this.requests = this.requests.filter(it => it !== request)
  }

  requestMatchesPattern = request => urlPattern.exec(request.url)

  requestMatchesUrl = request => this.requests.findIndex(it => it.url === request.url) !== -1

  isExpectedRequest = request => this.isExpectedMethod(request) && this.requestContainsOldValueUuid(request)

  isExpectedMethod = request => request.method === 'PATCH'

  requestContainsOldValueUuid = request => request.context && request.context.oldValue && request.context.oldValue.uuid
}
