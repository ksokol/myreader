import {getNextNotificationId, getNotifications, mediaBreakpointIsDesktopSelector} from '../../store'
import {pendingRequestCountSelector} from './selectors'

describe('common selectors', () => {

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

  it('mediaBreakpointIsDesktopSelector should return true when mediaBreakpoint is set to "desktop"', () => {
    expect(mediaBreakpointIsDesktopSelector(state({mediaBreakpoint: 'desktop'}))).toEqual(true)
  })

  it('mediaBreakpointIsDesktopSelector should return false when mediaBreakpoint is set to "other"', () => {
    expect(mediaBreakpointIsDesktopSelector(state({mediaBreakpoint: 'other'}))).toEqual(false)
  })

  it('pendingRequestCountSelector should return 2 for pendingRequests', () => {
    expect(pendingRequestCountSelector(state({pendingRequests: 2}))).toEqual(2)
  })
})
