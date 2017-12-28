export {settingsReducers} from './reducers'
export * from './actions'
export * from './selectors'
export * from './settings'

export default function initialState() {
    return {
        pageSize: 10,
        showUnseenEntries: true,
        showEntryDetails: true
    }
}
