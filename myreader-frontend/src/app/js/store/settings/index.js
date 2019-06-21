export {settingsReducers} from './reducers'
export * from './actions'
export * from './selectors'

export default function initialState() {
  return {
    pageSize: 10,
    showUnseenEntries: true,
    showEntryDetails: true
  }
}
