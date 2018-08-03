export * from './actions'
export * from './selectors'
export {adminReducers} from './reducers'

export default function initialState() {
  return {
    applicationInfo: {},
    feeds: [],
    selectedFeed: {},
    fetchFailures: {failures: []},
    fetchFailuresLoading: false
  }
}
