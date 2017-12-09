import {getNextNotificationId, getNotifications, getPendingRequests} from './selectors'

describe('src/app/js/store/common/selectors.spec.js', () => {

    it('should select notifications', () => {
        const state = {
            common: {
                notification: {
                    nextId: 3,
                    notifications: [
                        {id: 1, text: 'notification1'},
                        {id: 2, text: 'notification2'}
                    ]
                }
            }
        }

        expect(getNotifications(state)).toEqual({
            notifications: [
                {id: 1, text: 'notification1'},
                {id: 2, text: 'notification2'}
            ]
        })
    })

    it('should select nextId', () => {
        const state = {
            common: {
                notification: {
                    nextId: 3
                }
            }
        }

        expect(getNextNotificationId(() => state)).toEqual(3)
    })

    it('should select pendingRequests', () => {
        const state = {
            common: {
                pendingRequests: 1
            }
        }

        expect(getPendingRequests(state)).toEqual({pendingRequests: 1})
    })
})
