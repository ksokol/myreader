export * from './actions'
export * from './selectors'
export {entryReducers} from './reducers'

export default function initialState() {
  return {
    links: {},
    entries: [],
    loading: false
  }
}
