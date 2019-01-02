export {subscriptionReducers} from './reducers'
export * from './actions'
export * from './selectors'

export default function initialState() {
  return {
    subscriptions: [],
    exclusions: {},
    editForm: {
      changePending: false,
      data: null,
      validations: []
    }
  }
}
