import {cloneObject} from '../shared/objects'

export const subscriptionsSelector = state => {
  return {
    subscriptions: state.subscription.subscriptions.map(cloneObject)
  }
}

