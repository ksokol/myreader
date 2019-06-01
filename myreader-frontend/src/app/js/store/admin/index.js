export * from './actions'
export * from './selectors'
export {adminReducers} from './reducers'

export default function initialState() {
  return {
    feeds: [],
    fetchFailures: {failures: []},
    fetchFailuresLoading: false
  }
}
