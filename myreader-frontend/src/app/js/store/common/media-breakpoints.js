import {mediaBreakpointChanged} from 'store'
import {supportedBreakpoints} from '../../constants'

function createMediaBreakpoints() {
    return Object.entries(supportedBreakpoints()).reduce((breakpoint, [name, mediaQueryString]) => {
        const mql = window.matchMedia(mediaQueryString)
        breakpoint[mql.media] = {name, mql}
        return breakpoint
    }, {})
}

function createMediaBreakpointListener(store, mediaBreakpoints) {
    return event => event.matches && store.dispatch(mediaBreakpointChanged(mediaBreakpoints[event.media].name))
}

function registerAndRunMediaBreakpointListener(store, mediaBreakpoint, mediaBreakpoints) {
    const mediaBreakpointListener = createMediaBreakpointListener(store, mediaBreakpoints)
    mediaBreakpoint.mql.addListener(mediaBreakpointListener)
    mediaBreakpointListener(mediaBreakpoint.mql)
}

function createAndInstallMediaBreakpointListeners(store) {
    const mediaBreakpoints = createMediaBreakpoints()
    Object.values(mediaBreakpoints).forEach(mediaBreakpoint => registerAndRunMediaBreakpointListener(store, mediaBreakpoint, mediaBreakpoints))
}

export const installMediaBreakpointActionDispatcher = store => createAndInstallMediaBreakpointListeners(store)
