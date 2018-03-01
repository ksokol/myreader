export * from './actions'
export * from './selectors'
export {commonReducers} from './reducers'

export default function initialState() {
    return {
        pendingRequests: 0,
        notification: {
            nextId: 0,
            notifications: []
        },
        mediaBreakpoint: '',
        backdropVisible: false,
        sidenavSlideIn: false,
    }
}
