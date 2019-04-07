export * from './actions'
export * from './selectors'
export {securityReducers} from './reducers'

export default function initialState() {
  return {
    roles: [],
    loginForm: {
      loginPending: false,
      loginFailed: false
    }
  }
}
