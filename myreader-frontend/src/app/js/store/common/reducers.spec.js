import initialState from './index'
import {commonReducers} from '../../store'

describe('common reducers', () => {

  let state

  beforeEach(() => state = initialState())

  it('initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'}

    expect(commonReducers(state, action)).toEqual(state)
  })

  it('action SHOW_NOTIFICATION', () => {
    const action = {
      type: 'SHOW_NOTIFICATION',
      notification: {id: 0, text: 'notification0'}
    }

    const expectedState = {
      notification: {
        nextId: 1,
        notifications: [
          {id: 0, text: 'notification0'}
        ]
      }
    }

    expect(commonReducers(state, action)).toContainObject(expectedState)
  })

  it('action REMOVE_NOTIFICATION', () => {
    const action = {
      type: 'REMOVE_NOTIFICATION',
      id: 1
    }

    const currentState = {
      notification: {
        nextId: 3,
        notifications: [
          {id: 1, text: 'notification1'},
          {id: 2, text: 'notification2'}
        ]
      }
    }

    const expectedState = {
      notification: {
        nextId: 3,
        notifications: [
          {id: 2, text: 'notification2'}
        ]
      }
    }

    expect(commonReducers(currentState, action)).toContainObject(expectedState)
  })
})
