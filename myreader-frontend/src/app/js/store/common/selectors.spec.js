import {getNextNotificationId, getNotifications} from '../../store'
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

  it('pendingRequestCountSelector should return 2 for pendingRequests', () => {
    expect(pendingRequestCountSelector(state({pendingRequests: 2}))).toEqual(2)
  })
})
