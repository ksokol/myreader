import {
    backdropIsVisible,
    getNextNotificationId,
    getNotifications,
    getPendingRequests,
    mediaBreakpointIsDesktopSelector,
    sidenavSlideIn
} from '../../store'

describe('src/app/js/store/common/selectors.spec.js', () => {

    const state = common => {
        return {common}
    }

    it('should select notifications', () => {
        const currentState = state({
            notification: {
                nextId: 3,
                notifications: [
                    {id: 1, text: 'notification1'},
                    {id: 2, text: 'notification2'}
                ]
            }
        })

        expect(getNotifications(currentState)).toEqual({
            notifications: [
                {id: 1, text: 'notification1'},
                {id: 2, text: 'notification2'}
            ]
        })
    })

    it('should select nextId', () => {
        expect(getNextNotificationId(state({notification: {nextId: 3}}))).toEqual(3)
    })

    it('should select pendingRequests', () => {
        expect(getPendingRequests(state({pendingRequests: 1}))).toEqual({pendingRequests: 1})
    })

    it('mediaBreakpointIsDesktopSelector should return true when mediaBreakpoint is set to "desktop"', () => {
        expect(mediaBreakpointIsDesktopSelector(state({mediaBreakpoint: 'desktop'}))).toEqual(true)
    })

    it('mediaBreakpointIsDesktopSelector should return false when mediaBreakpoint is set to "other"', () => {
        expect(mediaBreakpointIsDesktopSelector(state({mediaBreakpoint: 'other'}))).toEqual(false)
    })

    it('sidenavSlideIn should return true', () => {
        expect(sidenavSlideIn(state({sidenavSlideIn: true}))).toEqual(true)
    })

    it('backdropIsVisible should return true', () => {
        expect(backdropIsVisible(state({backdropVisible: true}))).toEqual(true)
    })
})
