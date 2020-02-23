import {getNextNotificationId, getNotifications} from '../../store'

const state = common => ({common})

describe('common selectors', () => {

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
})
