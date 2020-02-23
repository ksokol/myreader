export * from './actions'
export * from './selectors'
export {commonReducers} from './reducers'

export default function initialState() {
  return {
    notification: {
      nextId: 0,
      notifications: []
    }
  }
}
