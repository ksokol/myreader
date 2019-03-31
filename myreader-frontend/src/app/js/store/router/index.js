export * from './actions'
export {routerReducers} from './reducers'

export default function initialState() {
  return {
    currentRoute: [],
    query: {}
  }
}
